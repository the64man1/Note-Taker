
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const notes = [
    {
        "title":"Test Title",
        "text":"Test text"
    }
];

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => res.json(notes));

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));