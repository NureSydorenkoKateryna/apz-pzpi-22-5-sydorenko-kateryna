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

interface UnitsResponse {
  units: UnitDto[];
}

interface UnitDto {
  id: number;
  value: string;
}

interface CreateProductsRequest {
  products: CreateProductRequest[];
}

interface CreateProductRequest {
  name: string;
  unitId: number;
  shelfLifeDays: number | null;
}