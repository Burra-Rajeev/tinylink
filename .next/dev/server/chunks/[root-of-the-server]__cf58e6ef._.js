module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/lib/prisma.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const prisma = global.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) global.prisma = prisma;
const __TURBOPACK__default__export__ = prisma;
}),
"[externals]/valid-url [external] (valid-url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("valid-url", () => require("valid-url"));

module.exports = mod;
}),
"[project]/pages/api/links/index.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$valid$2d$url__$5b$external$5d$__$28$valid$2d$url$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/valid-url [external] (valid-url, cjs)");
;
;
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;
async function handler(req, res) {
    if (req.method === "GET") {
        const links = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].link.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        return res.status(200).json(links);
    }
    if (req.method === "POST") {
        const body = req.body || {};
        const url = (body.url || "").toString().trim();
        const customCode = (body.code || "").toString().trim();
        if (!url || !__TURBOPACK__imported__module__$5b$externals$5d2f$valid$2d$url__$5b$external$5d$__$28$valid$2d$url$2c$__cjs$29$__["default"].isWebUri(url)) {
            return res.status(400).json({
                error: "Invalid or missing URL"
            });
        }
        let code = customCode;
        if (code) {
            if (!CODE_REGEX.test(code)) {
                return res.status(400).json({
                    error: "Custom code must match [A-Za-z0-9]{6,8}"
                });
            }
            const exists = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].link.findUnique({
                where: {
                    code
                }
            });
            if (exists) return res.status(409).json({
                error: "Code already exists"
            });
        } else {
            const generate = ()=>{
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                let s = "";
                for(let i = 0; i < 6; i++)s += chars[Math.floor(Math.random() * chars.length)];
                return s;
            };
            let attempts = 0;
            do {
                code = generate();
                const exists = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].link.findUnique({
                    where: {
                        code
                    }
                });
                if (!exists) break;
                attempts++;
            }while (attempts < 5)
        }
        const created = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].link.create({
            data: {
                code,
                url
            }
        });
        return res.status(201).json(created);
    }
    res.setHeader("Allow", [
        "GET",
        "POST"
    ]);
    return res.status(405).end("Method Not Allowed");
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cf58e6ef._.js.map