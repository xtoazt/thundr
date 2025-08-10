import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  // Minimal placeholder list to avoid JSON parse errors in serverless
  return res.status(200).send([]);
}


