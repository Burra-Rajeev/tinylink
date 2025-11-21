import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const code = (req.query.code || "").toString();

    if (!CODE_REGEX.test(code)) {
        return res.status(400).json({ error: "Invalid code format" });
    }

    if (req.method === "GET") {
        const link = await prisma.link.findUnique({ where: { code } });
        if (!link) return res.status(404).json({ error: "Not found" });
        return res.status(200).json(link);
    }

    if (req.method === "DELETE") {
        try {
            await prisma.link.delete({ where: { code } });
            return res.status(204).end();
        } catch {
            return res.status(404).json({ error: "Not found" });
        }
    }

    res.setHeader("Allow", ["GET", "DELETE"]);
    return res.status(405).end("Method Not Allowed");
}
