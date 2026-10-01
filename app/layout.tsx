import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RecipeBook",
    template: "%s | RecipeBook",
  },
  description: "Discover, save, and manage your favorite recipes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-900">
        {children}
      </body>
    </html>
  );
}