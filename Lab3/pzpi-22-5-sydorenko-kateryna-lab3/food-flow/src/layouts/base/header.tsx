'use client';

import { LanguageSwitcher } from '@/components/localeSwitcher';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/providers/authProvider';
import { LogOut, UtensilsCrossed } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const t = useTranslations('LogIn');

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
          <UtensilsCrossed className="w-8 h-8" />
          FoodFlow
        </Link>

        <nav className="flex items-center gap-4">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium ${
                  pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/menu"
                className={`text-sm font-medium ${
                  pathname === '/menu' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Menu
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                }}
                className="text-sm"
              >
                {t('logout')}
              </Button>
            </>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/login">
                <LogOut />
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
