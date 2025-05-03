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

export const getUnits = async (token: string) => {
  const response = await fetch(`${baseUrl}/products/units`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch units');
  }

  const data = await response.json();
  return data as UnitsResponse;
};

export const deleteProduct = async (token: string, productId: number) => {
  const response = await fetch(`${baseUrl}/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }

  return response.json();
};

export const createProducts = async (token: string, data: CreateProductRequest[]) => {
  const requestBody: CreateProductsRequest = {
    products: data,
  };

  const response = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('Failed to create products');
  }

  return response.json();
};

export const updateProduct = async (
  token: string,
  productId: number,
  data: CreateProductRequest
) => {
  const response = await fetch(`${baseUrl}/products/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update product');
  }

  return response.json();
};

