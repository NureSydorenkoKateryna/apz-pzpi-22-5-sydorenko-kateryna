import { NextIntlClientProvider } from 'next-intl';
import { AuthProvider } from './authProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider>
      <AuthProvider>{children}</AuthProvider>
    </NextIntlClientProvider>
  );
}
