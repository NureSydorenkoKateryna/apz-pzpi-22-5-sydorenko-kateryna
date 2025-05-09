interface IngredientDto {
    id: number;
    productId: number;
    name: string;
    unit: string;
    amount: number;
  }
  
interface TechCardDto {
    id: number;
    name: string;
    description: string;
    ingredients: IngredientDto[];
  }
  
interface TechCardsResponse {
    techCards: TechCardDto[];
  }


  interface CreateIngredientRequest {
    productId: number;
    quantity: number;
  }

  interface CreateTechCardRequest {
    name: string;
    description: string;
    ingredients: CreateIngredientRequest[];
  }

  interface CreateTechCardsRequest {
    restaurantId?: string; // optional as marked by '?'
    techChards: CreateTechCardRequest[];
  }
  