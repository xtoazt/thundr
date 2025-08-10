import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const query = (req.query?.query as string) || "";
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (!query) {
    return res.status(200).send([]);
  }
  try {
    const apiRes = await fetch(
      `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&format=list`
    );
    const contentType = apiRes.headers.get("content-type") || "";
    if (!apiRes.ok || !contentType.includes("application/json")) {
      return res.status(200).send([]);
    }
    const data = await apiRes.json();
    return res.status(200).send(data);
  } catch (e) {
    return res.status(200).send([]);
  }
}


