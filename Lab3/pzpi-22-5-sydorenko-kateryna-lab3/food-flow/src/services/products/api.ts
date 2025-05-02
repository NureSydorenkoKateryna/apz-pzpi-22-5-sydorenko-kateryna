const baseUrl = process.env.NEXT_PUBLIC_CULINARY_API_URL;

export const getProducts = async (token: string) => {
  const response = await fetch(`${baseUrl}/restaurant/products`, {
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
  return data as ProductsResponse;
};
