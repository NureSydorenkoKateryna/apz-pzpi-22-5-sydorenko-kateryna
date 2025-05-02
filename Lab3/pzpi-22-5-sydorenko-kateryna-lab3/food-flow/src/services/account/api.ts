const baseUrl = process.env.NEXT_PUBLIC_USER_API_URL;

export const logIn = async (email: string, password: string) => {
  const response = await fetch(`${baseUrl}/account/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid email or password');
  }

  const data = await response.json();
  return data as LoginResponse;
};
