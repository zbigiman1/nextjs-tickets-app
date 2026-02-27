import "@/app/globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { locales } from "@/i18n/config";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Lato } from "next/font/google";
import { notFound } from "next/navigation";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Next.js Tickets App",
  description:
    "Next.js demo app for managing support tickets, showcasing Next.js features like the App Router, Server Components, and API Routes.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}) {
  // params can be a Promise in Next.js — await it before using
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={`${lato.variable} antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="max-w-7xl min-h-120 mx-auto p-4 md:p-8">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
