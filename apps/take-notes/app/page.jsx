"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadNotes() {
    const response = await fetch("/api/notes", { cache: "no-store" });
    const data = await response.json();
    setNotes(data.notes || []);
    setLoading(false);
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function addNote(event) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    await fetch("/api/notes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, body })
    });
    setTitle("");
    setBody("");
    await loadNotes();
  }

  async function deleteNote(id) {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    await loadNotes();
  }

  return (
    <main>
      <h1>Take Notes</h1>
      <p>A small SQLite-backed notes app for Okastr8 OpenNext monorepo testing.</p>

      <form onSubmit={addNote}>
        <input
          aria-label="Note title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
        />
        <textarea
          aria-label="Note body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write a note"
        />
        <button type="submit">Save note</button>
      </form>

      <section className="notes">
        {loading ? <p>Loading notes...</p> : null}
        {!loading && notes.length === 0 ? <p>No notes yet.</p> : null}
        {notes.map((note) => (
          <article className="note" key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.body}</p>
            <div className="muted">{note.created_at}</div>
            <div className="note-actions">
              <button className="danger" onClick={() => deleteNote(note.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
