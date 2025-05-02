import { useAuth } from '@/lib/providers/authProvider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { logIn as logInRequest } from './api';

export default function useAccountService() {
  const { login: setToken } = useAuth();
  const router = useRouter();
  const logIn = async (email: string, password: string) => {
    await logInRequest(email, password)
      .then(response => {
        if (response.token) {
          setToken(response.token);
          router.push('/');
        }
      })
      .catch(() => {
        toast.error('Invalid email or password', {
          description: 'Please check your credentials and try again.',
          action: {
            onClick: () => {},
            label: 'Retry',
          },
        });
      });
  };

  return {
    logIn,
  };
}
