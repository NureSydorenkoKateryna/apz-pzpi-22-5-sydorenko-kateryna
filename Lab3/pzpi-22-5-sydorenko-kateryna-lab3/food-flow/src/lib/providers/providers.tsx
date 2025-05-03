import { NextIntlClientProvider } from 'next-intl';
import { AuthProvider } from './authProvider';
import ReduxProvider from './reduxProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider>
      <ReduxProvider>
        <AuthProvider>{children}</AuthProvider>
      </ReduxProvider>
    </NextIntlClientProvider>
  );
}
