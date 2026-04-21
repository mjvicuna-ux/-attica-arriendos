import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import LayoutContenido from "./components/LayoutContenido";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Attica Arriendos",
  description: "Plataforma de administración de arriendos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <LayoutContenido>{children}</LayoutContenido>
      </body>
    </html>
  );
}
