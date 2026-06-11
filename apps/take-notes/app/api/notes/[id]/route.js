import { run } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(request, context) {
  const { id } = await context.params;
  const body = await request.json();
  if (typeof body.title === "string") {
    await run("UPDATE notes SET title = ? WHERE id = ?", [body.title.trim(), Number(id)]);
  }
  if (typeof body.body === "string") {
    await run("UPDATE notes SET body = ? WHERE id = ?", [body.body.trim(), Number(id)]);
  }
  return Response.json({ ok: true });
}

export async function DELETE(_request, context) {
  const { id } = await context.params;
  await run("DELETE FROM notes WHERE id = ?", [Number(id)]);
  return Response.json({ ok: true });
}
