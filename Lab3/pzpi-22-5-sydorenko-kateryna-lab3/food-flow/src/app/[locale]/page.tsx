import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <main className="flex flex-col items-center justify-center px-4 py-40 text-center bg-[var(--color-background)] text-[var(--color-foreground)]">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-[var(--color-primary)]">
        {t('title')}
      </h1>
      <p className="text-lg sm:text-xl mb-8 text-[var(--color-muted-foreground)]">
        {t('subtitle')}
      </p>
      <Link
        href="/about"
        className="px-6 py-3 rounded-xl bg-[var(--color-verdigris)] text-[var(--color-black)] hover:bg-[var(--color-celadon)] transition-colors font-semibold"
      >
        {t('about')}
      </Link>
    </main>
  );
}
