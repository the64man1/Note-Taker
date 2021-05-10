
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
/*
const notes = [
    {
        "title":"Test Title",
        "text":"Test text",
        "id": "1"
    },
    {
        "title":"Test2",
        "text":"Test text2",
        "id": "2"
    }
];*/

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

const writeFile = (data, callback) => {

};

generateID = () => crypto.randomBytes(8).toString('hex');

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => {
    /*
    fs.readFile('db.json', 'utf-8', (err, data) => {
        if (err) throw err;

        res.send(data);
    });
    */

    readFile((data) => {
        res.send(data);
    })
});

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
        /*
        writeFile(notesArr, () => {
            res.send();
        });
        */
        fs.writeFile(dbFile, notesArr, (err) => {
            if (err) throw err;
            res.send();
        });
    });
})

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));