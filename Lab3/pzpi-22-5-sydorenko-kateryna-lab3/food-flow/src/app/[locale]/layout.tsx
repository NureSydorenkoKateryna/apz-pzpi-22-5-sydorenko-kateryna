import { routing } from '@/i18n/routing';
import Footer from '@/layouts/base/footer';
import Header from '@/layouts/base/header';
import Providers from '@/lib/providers/providers';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { Toaster } from 'sonner';
import './globals.css';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-[var(--background)] text-[var(--foreground)]"
        suppressHydrationWarning
      >
        <Providers>
          <Header />
          <main>{children}</main>
          <Toaster />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
