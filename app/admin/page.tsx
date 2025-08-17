'use client';

import { useEffect, useState } from "react";

interface Booking {
    userId: number;
    wash: string;
    time: string;
    status?: string;
}

export default function AdminPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);

    const fetchBookings = async () => {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        setBookings(data.bookings);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (userId: number, time: string, action: string) => {
        await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, time, action }),
        });
        fetchBookings();
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Админ-панель АвтоСлот</h1>
            <table border={1} cellPadding={10} style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <th>User ID</th>
                    <th>Мойка</th>
                    <th>Время</th>
                    <th>Статус</th>
                    <th>Действие</th>
                </tr>
                </thead>
                <tbody>
                {bookings.map((b, i) => (
                    <tr key={i}>
                        <td>{b.userId}</td>
                        <td>{b.wash}</td>
                        <td>{b.time}</td>
                        <td>{b.status || "Новая"}</td>
                        <td>
                            <button onClick={() => updateStatus(b.userId, b.time, "confirmed")}>Подтвердить</button>
                            <button onClick={() => updateStatus(b.userId, b.time, "canceled")}>Отменить</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}