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
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        const res = await fetch("/api/bookings");
        const data = await res.json();
        setBookings(data.bookings || []);
        setLoading(false);
    };

    const updateStatus = async (userId: number, time: string, action: string) => {
        await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, time, action }),
        });
        fetchBookings();
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Админ-панель АвтоСлот</h1>

            {loading ? (
                <p className="text-center">Загрузка...</p>
            ) : bookings.length === 0 ? (
                <p className="text-center text-gray-500">Записей пока нет.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="py-3 px-6 text-left">User ID</th>
                            <th className="py-3 px-6 text-left">Мойка</th>
                            <th className="py-3 px-6 text-left">Время</th>
                            <th className="py-3 px-6 text-left">Статус</th>
                            <th className="py-3 px-6 text-left">Действие</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookings.map((b, i) => (
                            <tr key={i} className="border-b hover:bg-gray-100">
                                <td className="py-3 px-6">{b.userId}</td>
                                <td className="py-3 px-6">{b.wash}</td>
                                <td className="py-3 px-6">{b.time}</td>
                                <td className="py-3 px-6 capitalize">{b.status || "new"}</td>
                                <td className="py-3 px-6 space-x-2">
                                    <button
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                        onClick={() => updateStatus(b.userId, b.time, "confirmed")}
                                    >
                                        Подтвердить
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        onClick={() => updateStatus(b.userId, b.time, "canceled")}
                                    >
                                        Отменить
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}