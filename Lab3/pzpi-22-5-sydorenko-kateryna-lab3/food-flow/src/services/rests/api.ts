const baseUrl = process.env.NEXT_PUBLIC_MOVEMENTS_API_URL;

export const getRests = async (token: string) => {
  const response = await fetch(`${baseUrl}/rests/restaurant`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data = await response.json();
  return data as RestsResponse;
};

export const updateRestQuantity = async (token: string, productId: number, quantity: number) => {
  const response = await fetch(`${baseUrl}/rests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      rests: [
        {
          productId: productId.toString(),
          quantity,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update product quantity');
  }
};
