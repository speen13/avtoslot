import { NextResponse } from "next/server";

// Импортируем массив bookings из бота
// Если код бота и API в одном проекте, можно экспортировать bookings
import { bookings } from "../bot/route"; // путь поправь, если нужно

export async function GET() {
    return NextResponse.json({ bookings });
}

// Обновление статуса записи (например, подтверждено / отменено)
export async function POST(req: Request) {
    const body = await req.json();
    const { userId, time, action } = body;

    const booking = bookings.find(b => b.userId === userId && b.time === time);
    if (booking) {
        booking.status = action; // action: "confirmed" или "canceled"
    }

    return NextResponse.json({ ok: true, bookings });
}