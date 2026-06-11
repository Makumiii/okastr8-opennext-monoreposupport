import { run } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(request, context) {
  const { id } = await context.params;
  const body = await request.json();
  if (typeof body.done === "boolean") {
    await run("UPDATE tasks SET done = ? WHERE id = ?", [body.done ? 1 : 0, Number(id)]);
  }
  if (typeof body.title === "string") {
    await run("UPDATE tasks SET title = ? WHERE id = ?", [body.title.trim(), Number(id)]);
  }
  return Response.json({ ok: true });
}

export async function DELETE(_request, context) {
  const { id } = await context.params;
  await run("DELETE FROM tasks WHERE id = ?", [Number(id)]);
  return Response.json({ ok: true });
}
