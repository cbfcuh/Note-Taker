const express = require('express');
const path = require('path');
const notesDB = require('./db/db.json');
const fs = require('fs');
const crypto = require('crypto'); // Built in module to generate uuids

const PORT = process.env.PORT || 3001;

const app = express();

const uuid = () => {
    return crypto.randomUUID();
};

// Here we use middleware to serve static fies and send route to the index.html
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for serving notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Route for generating notes 
app.post('/api/notes', (req, res) => {
    const addNote = req.body;
    addNote.id = uuid();
    notesDB.push(addNote);

    fs.writeFile('./db/db.json', JSON.stringify(notesDB, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ message: 'Failed to save the note'}); // Potentially error stat 500?? unsure 
        }
        res.json(notesDB);
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

