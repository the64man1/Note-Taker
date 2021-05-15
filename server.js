const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbFile = 'db/db.json';

// Reads JSON file and initializes with empty array if file is empty
const readFile = (callback) => {
    fs.readFile(dbFile, 'utf-8', (err, data) => {
        if (err) throw err;
        if (data === '') {
            let emptyArr = '[]';
            fs.writeFile(dbFile, emptyArr, (err) => {
                if (err) throw err;
                callback(emptyArr);
            });
        } else {
            callback(data);
        }
    })
};

//function to generate random ID for each note
generateID = () => crypto.randomBytes(8).toString('hex');

// handle page requests
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// handle front end request for stored notes to display
app.get('/api/notes', (req, res) => {
    readFile((data) => {
        res.send(data);
    })
});

// handle post requests to add notes to the db.json
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const id = generateID();
    newNote.id = id;

    readFile((data) => {
        let notesArr = JSON.parse(data);
        notesArr.push(newNote);
        notesArr = JSON.stringify(notesArr);
        fs.writeFile(dbFile, notesArr, (err) => {
            if (err) throw err;
            res.json(newNote);
        });
    })

})

//handle delete requests to remove note from db.json when the delete icon is clicked on a note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    readFile((data) => {
        let notesArr = JSON.parse(data);
        for (let i = 0; i < notesArr.length; i++) {
            if (notesArr[i].id === noteId) {
                notesArr.splice(i, 1);
                break;
            }
        }
        notesArr = JSON.stringify(notesArr);
        fs.writeFile(dbFile, notesArr, (err) => {
            if (err) throw err;
            res.send();
        });
    });
})

//handle port listen request
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));