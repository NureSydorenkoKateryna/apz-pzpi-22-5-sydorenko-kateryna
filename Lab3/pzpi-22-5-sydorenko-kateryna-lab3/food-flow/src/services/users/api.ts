const baseUrl = process.env.NEXT_PUBLIC_CULINARY_API_URL;

export const getUsers = async (token: string): Promise<UsersResponse> => {
  const response = await fetch(`${baseUrl}/users/2`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

export const createUser = async (
  token: string,
  data: CreateUserRequest
): Promise<number> => {
  const response = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
};

export const updateUser = async (token: string, data: UpdateUserRequest): Promise<boolean> => {
  const response = await fetch(`${baseUrl}/users/${data.userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  const result = await response.json();
  return result === true;
};

export const deleteUser = async (token: string, userId: number): Promise<boolean> => {
  const response = await fetch(`${baseUrl}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }

  const result = await response.json();
  return result === true;
};
