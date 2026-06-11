import { run } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.json();
  const id = Number(body.id);
  if (!id) {
    return Response.json({ error: "Task id is required" }, { status: 400 });
  }

  if (body.action === "start") {
    await run("UPDATE tasks SET active_started_at = ? WHERE id = ?", [
      new Date().toISOString(),
      id
    ]);
  } else if (body.action === "complete") {
    await run(
      "UPDATE tasks SET pomodoros = pomodoros + 1, active_started_at = NULL WHERE id = ?",
      [id]
    );
  } else if (body.action === "stop") {
    await run("UPDATE tasks SET active_started_at = NULL WHERE id = ?", [id]);
  } else {
    return Response.json({ error: "Unknown pomodoro action" }, { status: 400 });
  }

  return Response.json({ ok: true });
}
