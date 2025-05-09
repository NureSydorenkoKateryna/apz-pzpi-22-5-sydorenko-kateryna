const baseUrl = process.env.NEXT_PUBLIC_CULINARY_API_URL;

export const getTechCards = async (token: string) => {
  const response = await fetch(`${baseUrl}/techcards`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tech cards');
  }

  const data = await response.json();
  return data as TechCardsResponse;
};

export const deleteTechCard = async (token: string, techCardId: number) => {
  const response = await fetch(`${baseUrl}/techcards/${techCardId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete tech card');
  }

  return response.json();
};

export const createTechCard = async (token: string, data: CreateTechCardRequest) => {
  const requestBody = {
    TechCards: [data],
  };

  console.log('Request Body:', requestBody); // Debugging line

  const response = await fetch(`${baseUrl}/techcards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('Failed to create tech card');
  }

  return response.json();
};

export const updateTechCard = async (
  token: string,
  techCardId: number,
  data: CreateTechCardRequest
) => {
  const response = await fetch(`${baseUrl}/techcards/${techCardId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update tech card');
  }
};
