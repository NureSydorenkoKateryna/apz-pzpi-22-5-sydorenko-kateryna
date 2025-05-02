'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

import { useAuth } from '@/lib/providers/authProvider';
import { useRouter } from 'next/navigation';
// import { useAppDispatch } from '@/services/hooks';
// import { login } from '@/services/features/account/api';
// import { setUser } from '@/services/features/account/slice';
// import { getErrorMessage } from '@/services/helpers';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const t = useTranslations('LogIn');

  //   const dispatch = useAppDispatch();
  const { login: setToken } = useAuth();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginData) => {
    console.log('Form submitted:', data);
    router.push('/tech-cards');
    // login({ email: data.email, password: data.password })
    //   .then((res) => {
    //     dispatch(setUser(res.user));
    //     setToken(res.token);
    //     router.replace('/dashboard'); // Adjust route
    //     router.refresh();
    //   })
    //   .catch((err) => {
    //     const errorRes = getErrorMessage(err);
    //     toast.error(errorRes.message);
    //   });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md mx-auto space-y-6 p-6 bg-white shadow-lg rounded-xl border"
      >
        <h2 className="text-2xl font-bold text-center">{t('login')}</h2>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('email')}</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('password')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...field}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" onClick={() => setToken('44455sdffdsf')}>
          {t('login')}
        </Button>
      </form>
    </Form>
  );
}
