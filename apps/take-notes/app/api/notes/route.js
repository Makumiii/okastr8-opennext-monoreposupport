import { all, run } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const notes = await all("SELECT * FROM notes ORDER BY id DESC");
  return Response.json({ notes });
}

export async function POST(request) {
  const body = await request.json();
  const title = String(body.title || "").trim();
  const noteBody = String(body.body || "").trim();
  if (!title || !noteBody) {
    return Response.json({ error: "Title and body are required" }, { status: 400 });
  }
  await run("INSERT INTO notes (title, body) VALUES (?, ?)", [title, noteBody]);
  const notes = await all("SELECT * FROM notes ORDER BY id DESC");
  return Response.json({ notes });
}
