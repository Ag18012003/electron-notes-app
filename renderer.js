const { ipcRenderer } = require('electron');

document.getElementById('save-button').addEventListener('click', async () => {
  const content = document.getElementById('note-content').value;
  if (content) {
    const notes = await ipcRenderer.invoke('save-note', content);
    loadNotes(notes);
  }
});

async function loadNotes(notes = null) {
  const noteList = document.getElementById('note-list');
  noteList.innerHTML = '';

  if (!notes) {
    notes = await ipcRenderer.invoke('load-notes');
  }

  notes.forEach((note, index) => {
    const noteItem = document.createElement('div');
    noteItem.textContent = `Note ${index + 1}`;
    noteItem.style.cursor = 'pointer';
    noteItem.addEventListener('click', () => {
      document.getElementById('note-content').value = note;
    });
    noteList.appendChild(noteItem);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadNotes();
});
