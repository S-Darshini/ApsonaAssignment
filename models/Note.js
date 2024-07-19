const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
    }],
    color: {
        type: String,
        default: '#ffffff',
    },
    archived: {
        type: Boolean,
        default: false,
    },
    trash: {
        type: Boolean,
        default: false,
    },
    dueDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

NoteSchema.index({ title: 'text', content: 'text', tags: 'text' });
module.exports =mongoose.model('Note', NoteSchema);
