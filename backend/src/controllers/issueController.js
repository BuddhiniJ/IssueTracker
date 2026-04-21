const { validationResult } = require('express-validator');
const Issue = require('../models/Issue');

// GET /api/issues
const getIssues = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      issueType,
      priority,
      severity,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};

    // Role-based filtering: users only see their own issues; admins see all
    if (req.user.role !== 'admin') {
      filter.createdBy = req.user._id;
    }

    // Search by title or description
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (status) filter.status = status;
    if (issueType) filter.issueType = issueType;
    if (priority) filter.priority = priority;
    if (severity) filter.severity = severity;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [issues, total] = await Promise.all([
      Issue.find(filter)
        .populate('createdBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Issue.countDocuments(filter)
    ]);

    // Status counts for dashboard
    const statusFilter = req.user.role !== 'admin' ? { createdBy: req.user._id } : {};
    const statusCounts = await Issue.aggregate([
      { $match: statusFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const counts = { open: 0, in_progress: 0, resolved: 0, closed: 0 };
    statusCounts.forEach(({ _id, count }) => {
      counts[_id] = count;
    });

    res.json({
      issues,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      },
      statusCounts: counts
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/issues/:id
const getIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', 'name email')

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Users can only view their own issues
    if (req.user.role !== 'admin' && issue.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ issue });
  } catch (err) {
    next(err);
  }
};

// POST /api/issues
const createIssue = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array().map(e => e.msg) });
    }

    const { title, description, issueType, priority, severity, dueDate, tags } = req.body;
    const normalizedIssueType = typeof issueType === 'string' ? issueType.trim().toLowerCase() : issueType;

    const issue = await Issue.create({
      title,
      description,
      issueType: normalizedIssueType,
      priority,
      severity,
      dueDate: dueDate || null,
      tags: tags || [],
      createdBy: req.user._id
    });

    const populated = await issue.populate('createdBy', 'name email');

    res.status(201).json({ message: 'Issue created successfully', issue: populated });
  } catch (err) {
    next(err);
  }
};

// PUT /api/issues/:id
const updateIssue = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array().map(e => e.msg) });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Users can only edit their own issues
    if (req.user.role !== 'admin' && issue.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only edit your own issues' });
    }

    if (req.user.role === 'admin') {
      const remark = typeof req.body.remark === 'string' ? req.body.remark.trim() : undefined;
      const keys = Object.keys(req.body);
      const invalidFields = keys.filter((key) => key !== 'status' && key !== 'remark');
      if (invalidFields.length > 0) {
        return res.status(403).json({ error: 'Admins can only update issue status and remark' });
      }

      if (req.body.status === undefined) {
        return res.status(400).json({ error: 'Status is required for admin update' });
      }

      if (req.body.status === 'closed' && !remark) {
        return res.status(400).json({ error: 'Remark is required when closing an issue' });
      }

      if (remark && req.body.status !== 'resolved' && req.body.status !== 'closed') {
        return res.status(400).json({ error: 'Remark can only be added when resolving or closing an issue' });
      }

      issue.status = req.body.status;
      if (req.body.status === 'resolved' && remark !== undefined) {
        issue.resolutionRemark = remark;
      }
      if (req.body.status === 'closed') {
        issue.closureRemark = remark;
      }
      await issue.save();
      await issue.populate('createdBy', 'name email');
      return res.json({ message: 'Issue status updated successfully', issue });
    }

    // Users can edit only while issue is open and cannot change status directly.
    if (req.user.role !== 'admin') {
      if (issue.status !== 'open') {
        return res.status(403).json({ error: 'You can only edit your own issues while status is open' });
      }
      if (req.body.status !== undefined) {
        return res.status(403).json({ error: 'Only admins can change issue status' });
      }
    }

    const allowedFields = ['title', 'description', 'issueType', 'priority', 'severity', 'dueDate', 'tags'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'issueType' && typeof req.body.issueType === 'string') {
          issue.issueType = req.body.issueType.trim().toLowerCase();
        } else {
          issue[field] = req.body[field];
        }
      }
    });

    await issue.save();
    await issue.populate('createdBy', 'name email');

    res.json({ message: 'Issue updated successfully', issue });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/issues/:id
const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Admins can delete any issue; users can delete only their own issues.
    if (req.user.role !== 'admin' && issue.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own issues' });
    }

    await issue.deleteOne();
    res.json({ message: 'Issue deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// GET /api/issues/export
const exportIssues = async (req, res, next) => {
  try {
    const {
      format = 'json',
      search,
      status,
      issueType,
      priority,
      severity,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    const filter = req.user.role !== 'admin' ? { createdBy: req.user._id } : {};

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }
    if (status) filter.status = status;
    if (issueType) filter.issueType = issueType;
    if (priority) filter.priority = priority;
    if (severity) filter.severity = severity;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const issues = await Issue.find(filter)
      .populate('createdBy', 'name email')
      .sort(sort);

    if (format === 'csv') {
      const headers = ['Task #', 'Title', 'Description', 'Status', 'Priority', 'Severity', 'Created By', 'Due Date', 'Created At'];
      const rows = issues.map((i) => [
        i.issueNumber,
        `"${i.title.replace(/"/g, '""')}"`,
        `"${(i.description || '').replace(/"/g, '""')}"`,
        i.status,
        i.priority,
        i.severity,
        i.createdBy?.name || '',
        i.dueDate ? new Date(i.dueDate).toISOString().split('T')[0] : '',
        new Date(i.createdAt).toISOString()
      ]);

      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="issues.csv"');
      return res.send(csv);
    }

    const cleaned = issues.map((i) => {
      const obj = i.toObject();
      delete obj._id;
      delete obj.__v;
      if (obj.createdBy) delete obj.createdBy._id;
      return obj;
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="issues.json"');
    res.json(cleaned);
  } catch (err) {
    next(err);
  }
};

module.exports = { getIssues, getIssue, createIssue, updateIssue, deleteIssue, exportIssues };
