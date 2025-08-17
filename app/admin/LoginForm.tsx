'use client';

import { useState } from "react";

interface LoginFormProps {
    onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [visible, setVisible] = useState(true);
    const [showPassword, setShowPassword] = useState(false); // новое состояние

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (data.ok) {
                setError("");
                setVisible(false);
                setTimeout(() => onLoginSuccess(), 300);
            } else {
                setError("Неверный пароль");
            }
        } catch (err) {
            console.error(err);
            setError("Ошибка при подключении к серверу");
        }
    };

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${
                visible ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded shadow-lg w-full max-w-sm transform transition-transform duration-300 scale-100"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Вход в админку</h2>
                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? "Скрыть" : "Показать"}
                    </button>
                </div>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Войти
                </button>
            </form>
        </div>
    );
}