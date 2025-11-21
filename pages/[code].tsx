import { GetServerSideProps } from "next";
import prisma from "../lib/prisma";

export default function RedirectPage() {
    return null; // nothing to show, just redirecting
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const code = (context.params?.code || "").toString();

    const link = await prisma.link.findUnique({
        where: { code },
    });

    if (!link) {
        return {
            notFound: true,
        };
    }

    // Update click count + last clicked timestamp
    await prisma.link.update({
        where: { code },
        data: {
            clicks: { increment: 1 },
            lastClicked: new Date(),
        },
    });

    return {
        redirect: {
            destination: link.url,
            permanent: false, // ensures 302 redirect
        },
    };
};
