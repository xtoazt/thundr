import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  // Mirror server.ts behavior but always return JSON
  try {
    return res.status(200).send({ ok: true, data: [] });
  } catch (e) {
    return res.status(200).send({ ok: false, error: "NO_SPONSER" });
  }
}


