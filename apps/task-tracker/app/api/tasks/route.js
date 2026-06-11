import { all, run } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const tasks = await all("SELECT * FROM tasks ORDER BY id DESC");
  return Response.json({ tasks });
}

export async function POST(request) {
  const body = await request.json();
  const title = String(body.title || "").trim();
  if (!title) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }
  await run("INSERT INTO tasks (title) VALUES (?)", [title]);
  const tasks = await all("SELECT * FROM tasks ORDER BY id DESC");
  return Response.json({ tasks });
}
