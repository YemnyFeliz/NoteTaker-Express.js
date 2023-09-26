const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, readAndDelete } = require('../helpers/fsUtils');

notes.get('/', (req, res) =>
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

notes.post('/', (req, res) => {
    console.log(req.body)
    const { title, text } = req.body;

    if (req.body) {
        const newNotes = {
            id: uuidv4(),
            title: title,
            text: text,
        };

        readAndAppend(newNotes, './db/db.json');
        res.json('New note has been created successfully!');

    } else {
        res.errored('Something went wrong...');
    }
});

notes.delete('/:id', (req, res) => {
    const { id } = req.params;

    readAndDelete(id, './db/db.json', (err) => {
        if (err) {
            res.status(500).send('Could not delete note...');
        }else {
            res.status(200).send('Note has been deleted!');
        }
    });
});

module.exports = notes;