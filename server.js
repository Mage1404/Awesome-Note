const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const { notes } = require('./db/db');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(notes);
  });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes/:id', (req, res) => {
  const result = findById(req.params.id, notes);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.post('/api/notes', (req, res) => {
  // req.body is where our incoming content will be
  req.body.id = notes.length.toString();
  const result = createNewNote(req.body, notes);
  res.json(result);
});

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
 
  const projectIndex = findById(id, notes);
  notes.splice(projectIndex, 1);
  return res.send();
 });

function createNewNote(body, notearray) {
  const result = body;
  notearray.push(result);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notearray }, null, 2)
  );
  return result;
}

function findById(id, notes) {
  const result = notes.filter(notes => notes.id === id)[0];
  return result;
}

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });
  