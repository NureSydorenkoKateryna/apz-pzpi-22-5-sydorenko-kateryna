interface ProductDto {
    id: number;
    name: string;
    unit: string;
  }
  
interface ProductsResponse {
    products: ProductDto[];
}

  
interface ProductWithRest {
  id: number;
  name: string;
  unit: string;
  rest: {
    productId: string;
    quantity: number;
    updatedAt?: string;
  } | null;
}
