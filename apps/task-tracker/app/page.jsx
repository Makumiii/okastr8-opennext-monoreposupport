"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    const response = await fetch("/api/tasks", { cache: "no-store" });
    const data = await response.json();
    setTasks(data.tasks || []);
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(event) {
    event.preventDefault();
    if (!title.trim()) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title })
    });
    setTitle("");
    await loadTasks();
  }

  async function patchTask(id, patch) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch)
    });
    await loadTasks();
  }

  async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    await loadTasks();
  }

  async function pomodoro(id, action) {
    await fetch("/api/pomodoro", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, action })
    });
    await loadTasks();
  }

  return (
    <main>
      <h1>Task Tracker</h1>
      <p>Track tasks and attach pomodoro sessions to each task.</p>

      <form onSubmit={addTask}>
        <input
          aria-label="Task title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a deployment task"
        />
        <button type="submit">Add task</button>
      </form>

      <section className="tasks">
        {loading ? <p>Loading tasks...</p> : null}
        {!loading && tasks.length === 0 ? <p>No tasks yet.</p> : null}
        {tasks.map((task) => (
          <article className="task" key={task.id}>
            <header>
              <strong>{task.title}</strong>
              <span className="muted">{task.pomodoros} pomodoros</span>
            </header>
            <div className="muted">
              {task.done ? "Done" : "Open"}
              {task.active_started_at ? ` - active since ${task.active_started_at}` : ""}
            </div>
            <div className="task-actions">
              <button
                className="secondary"
                onClick={() => patchTask(task.id, { done: !task.done })}
              >
                {task.done ? "Reopen" : "Mark done"}
              </button>
              <button className="secondary" onClick={() => pomodoro(task.id, "start")}>
                Start pomodoro
              </button>
              <button className="secondary" onClick={() => pomodoro(task.id, "complete")}>
                Complete pomodoro
              </button>
              <button className="secondary" onClick={() => pomodoro(task.id, "stop")}>
                Stop
              </button>
              <button className="danger" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
