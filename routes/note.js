const express = require('express');
const auth = require('../middleware/auth');
const Note = require('../models/Note');

const router = express.Router();

router.post('/',auth, async (req, res) => {
    const { title, content, tags, color, dueDate } = req.body;
    //console.log(req.user.id);
    try {
        const newNote = new Note({
            user: req.user.id,
            title,
            content,
            tags,
            color,
            dueDate,
        });
        

        const note = await newNote.save();
        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id,archived: false, trash: false }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/:id', auth, async (req, res) => {
    const { title, content, tags, color, archived, trash, dueDate } = req.body;

    const noteFields = { title, content, tags, color, archived, trash, dueDate };

    try {
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ msg: 'Note not found' });
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: noteFields }, { new: true });

        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        //console.group(req.params.id);
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ msg: 'Note not found' });
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        //console.log(note);
        await Note.findByIdAndDelete(req.params.id);


        res.json({ msg: 'Note removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.get('/trashed', auth, async (req, res) => {
    console.log(req.user.id);
    try {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        const notes = await Note.find({ user: req.user.id, trash: true});
        console.log(notes);
        res.json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/search', auth, async (req, res) => {
    const { query } = req.query;
    try {
        const notes = await Note.find({ user: req.user.id, trash: false, archived: false, $text: { $search: query } });
        res.json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/archived', auth, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id, archived: true });
        res.json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
