import { NextRequest, NextResponse } from "next/server";
import { Telegraf } from "telegraf";

// Создаём бота с токеном из переменных окружения
const bot = new Telegraf(process.env.BOT_TOKEN!);

// Обработчик команды /start
bot.start((ctx) => {
    ctx.reply("Привет! 🚗 Я бот для записи на автомойку!");
});

// POST — Telegram присылает апдейты сюда
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        await bot.handleUpdate(body);
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Ошибка webhook:", err);
        return NextResponse.json({ ok: false, error: err });
    }
}

// GET — проверка работы API
export async function GET() {
    return NextResponse.json({ status: "bot is running" });
}