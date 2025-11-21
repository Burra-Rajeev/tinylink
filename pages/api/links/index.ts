import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import validUrl from "valid-url";

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const links = await prisma.link.findMany({ orderBy: { createdAt: "desc" } });
        return res.status(200).json(links);
    }

    if (req.method === "POST") {
        const body = req.body || {};
        const url = (body.url || "").toString().trim();
        const customCode = (body.code || "").toString().trim();

        if (!url || !validUrl.isWebUri(url)) {
            return res.status(400).json({ error: "Invalid or missing URL" });
        }

        let code = customCode;

        if (code) {
            if (!CODE_REGEX.test(code)) {
                return res.status(400).json({ error: "Custom code must match [A-Za-z0-9]{6,8}" });
            }
            const exists = await prisma.link.findUnique({ where: { code } });
            if (exists) return res.status(409).json({ error: "Code already exists" });
        } else {
            const generate = () => {
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                let s = "";
                for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
                return s;
            };

            let attempts = 0;
            do {
                code = generate();
                const exists = await prisma.link.findUnique({ where: { code } });
                if (!exists) break;
                attempts++;
            } while (attempts < 5);
        }

        const created = await prisma.link.create({
            data: {
                code,
                url,
            },
        });

        return res.status(201).json(created);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end("Method Not Allowed");
}
