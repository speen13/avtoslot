import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";

export async function POST(req: NextRequest) {
    const { password } = await req.json();

    if (password === ADMIN_PASSWORD) {
        return NextResponse.json({ ok: true });
    } else {
        return NextResponse.json({ ok: false });
    }
}