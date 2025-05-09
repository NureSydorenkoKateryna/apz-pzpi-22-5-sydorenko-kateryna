'use client';

import { LanguageSwitcher } from '@/components/localeSwitcher';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/providers/authProvider';
import { LogOut, UtensilsCrossed } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { isAuthenticated, logout, getRole } = useAuth();
  const pathname = usePathname();
  const t = useTranslations('HomePage');
  const role = getRole ? getRole() : null;

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
          <UtensilsCrossed className="w-8 h-8" />
          FoodFlow
        </Link>

        <nav className="flex items-center gap-4">
          <LanguageSwitcher />
          {isAuthenticated && role ? (
            <>
              {role === 'Admin' && (
                <Link
                  href="/users"
                  className={`text-sm font-medium ${
                    pathname.includes('/users') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {t('users')}
                </Link>
              )}

              {role === 'Chef' ||
                (role === 'Manager' && (
                  <>
                    <Link
                      href="/product-rests"
                      className={`text-sm font-medium ${
                        pathname.includes('/product-rests')
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {t('dashboard')}
                    </Link>
                    <Link
                      href="/tech-cards"
                      className={`text-sm font-medium ${
                        pathname.includes('/tech-cards') ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {t('techCards')}
                    </Link>
                  </>
                ))}

              <Button
                variant="outline"
                onClick={() => {
                  logout();
                }}
                className="text-sm"
              >
                <LogOut />
              </Button>
            </>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/login">
                <span className="text-sm">{t('login')}</span>
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
