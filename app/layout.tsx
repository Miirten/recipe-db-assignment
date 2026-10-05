import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RecipeBook",
  description: "Save and organize your recipes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-stone-50">
      <body
        className={`${nunito.variable} min-h-screen bg-stone-50 font-sans text-stone-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}