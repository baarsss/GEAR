import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "GEAR — автоуслуги рядом",
  description: "Поиск автосервисов и мастеров по услуге, автомобилю, цене и расположению.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}<nav className="legal-footer" aria-label="Правовая информация"><a href="/privacy">Политика обработки персональных данных</a><a href="/consent">Согласие на обработку персональных данных</a></nav></body>
    </html>
  );
}
