import { NextRequest, NextResponse } from "next/server";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start((ctx) => ctx.reply("Привет! 🚗 Я бот для записи на автомойку"));

// Здесь сохраняем состояние или записи позже

export async function POST(req: NextRequest) {
    const body = await req.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
}

export async function GET() {
    return NextResponse.json({ status: "bot is running" });
}