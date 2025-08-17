import { NextRequest, NextResponse } from "next/server";
import { Telegraf, Markup } from "telegraf";

// ✅ Экспортируем массив бронирований, чтобы админка могла его использовать
export const bookings: { userId: number; wash: string; time: string; status?: string }[] = [];

// Временное хранилище выбранной мойки для каждого пользователя
export const userSelectedWash: Record<number, string> = {};

// Создаём бота с токеном из переменных окружения
const bot = new Telegraf(process.env.BOT_TOKEN!);

// Обработчик команды /start с выбором мойки
bot.start((ctx) => {
    ctx.reply(
        "Привет! 🚗 Выберите мойку:",
        Markup.inlineKeyboard([
            [Markup.button.callback("Мойка 1", "wash_1")],
            [Markup.button.callback("Мойка 2", "wash_2")],
            [Markup.button.callback("Мойка 3", "wash_3")]
        ])
    );
});

// Обработчик нажатий на кнопки выбора мойки
bot.action(/wash_\d/, (ctx) => {
    const washId = ctx.match[0]; // wash_1, wash_2 и т.д.
    userSelectedWash[ctx.from.id] = washId;

    ctx.reply(
        `Вы выбрали ${washId}. Теперь выберите время:`,
        Markup.inlineKeyboard([
            [Markup.button.callback("10:00", "time_10")],
            [Markup.button.callback("11:00", "time_11")],
            [Markup.button.callback("12:00", "time_12")]
        ])
    );
});

// Обработчик нажатий на кнопки выбора времени
bot.action(/time_\d+/, (ctx) => {
    const time = ctx.match[0]; // time_10, time_11 и т.д.
    const userId = ctx.from.id;
    const wash = userSelectedWash[userId];

    if (!wash) {
        ctx.reply("Сначала выберите мойку!");
        return;
    }

    // Сохраняем запись с полем status
    bookings.push({ userId, wash, time, status: "new" });

    ctx.reply(`Вы выбрали ${wash} на время ${time}. Ваша запись подтверждена ✅`);
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

// GET — проверка работы API и просмотр всех записей
export async function GET() {
    return NextResponse.json({ status: "bot is running", bookings });
}