const express = require('express');
const { body } = require('express-validator');
const {
    getIssues, 
    getIssue, 
    createIssue, 
    updateIssue, 
    deleteIssue, 
    exportIssues
} = require('../controllers/issueController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

const commonIssueValidation = [
    body('description').optional().isLength({ max: 2000 }).withMessage('Description too long'),
    body('issueType').optional().isIn(['bug', 'feature', 'improvement', 'task']).withMessage('Invalid issue type'),
    body('remark').optional().isString().isLength({ max: 1000 }).withMessage('Remark must be up to 1000 characters'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('severity').optional().isIn(['minor', 'moderate', 'major', 'critical']).withMessage('Invalid severity'),
    body('status').optional().isIn(['open', 'in_progress', 'resolved', 'closed']).withMessage('Invalid status'),
    body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format')
];

const createIssueValidation = [
    body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
    body('issueType').exists({ checkFalsy: true }).withMessage('Issue type is required'),
    ...commonIssueValidation
];

const updateIssueValidation = [
    body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
    ...commonIssueValidation
];

// All routes require authentication
router.use(authenticate);

router.get('/export', exportIssues);
router.get('/', getIssues);
router.get('/:id', getIssue);
router.post('/', createIssueValidation, createIssue);
router.put('/:id', updateIssueValidation, updateIssue);
router.delete('/:id', deleteIssue);

module.exports = router;
