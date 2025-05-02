'use client';

import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchTo = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    router.push(segments.join('/'));
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={currentLocale === 'en' ? 'default' : 'outline'}
        onClick={() => switchTo('en')}
        className="px-4"
      >
        EN
      </Button>
      <Button
        variant={currentLocale === 'ua' ? 'default' : 'outline'}
        onClick={() => switchTo('ua')}
        className="px-4"
      >
        UA
      </Button>
    </div>
  );
}
