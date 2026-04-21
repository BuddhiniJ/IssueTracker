const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    issueNumber: {
      type: Number,
      unique: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: ''
    },
    issueType: {
      type: String,
      enum: ['bug', 'feature', 'improvement', 'task'],
      default: 'bug'
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    severity: {
      type: String,
      enum: ['minor', 'moderate', 'major', 'critical'],
      default: 'moderate'
    },
    dueDate: {
      type: Date,
      default: null
    },
    resolvedAt: {
      type: Date,
      default: null
    },
    closedAt: {
      type: Date,
      default: null
    },
    resolutionRemark: {
      type: String,
      trim: true,
      maxlength: [1000, 'Resolution remark cannot exceed 1000 characters'],
      default: ''
    },
    closureRemark: {
      type: String,
      trim: true,
      maxlength: [1000, 'Closure remark cannot exceed 1000 characters'],
      default: ''
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 30
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: null
    },
    updatedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes for search performance
issueSchema.index({ title: 'text', description: 'text' });
issueSchema.index({ status: 1, priority: 1 });
issueSchema.index({ createdBy: 1 });
issueSchema.index({ createdAt: -1 });

// Auto-increment issueNumber
issueSchema.pre('save', async function () {
  if (this.isNew) {
    const last = await this.constructor.findOne({}, {}, { sort: { issueNumber: -1 } });
    this.issueNumber = last?.issueNumber ? last.issueNumber + 1 : 1;
  }
});

// Auto-set timestamps on status change
issueSchema.pre('save', function () {
  if (this.isModified('status')) {
    if (this.status === 'resolved' && !this.resolvedAt) {
      this.resolvedAt = new Date();
    }
    if (this.status === 'closed' && !this.closedAt) {
      this.closedAt = new Date();
    }
    if (this.status !== 'resolved') {
      this.resolvedAt = null;
    }
    if (this.status !== 'closed') {
      this.closedAt = null;
    }
  }
});

module.exports = mongoose.model('issue', issueSchema);
