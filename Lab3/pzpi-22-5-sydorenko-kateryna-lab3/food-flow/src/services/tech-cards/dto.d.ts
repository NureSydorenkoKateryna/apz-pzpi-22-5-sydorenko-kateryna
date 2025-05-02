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
  