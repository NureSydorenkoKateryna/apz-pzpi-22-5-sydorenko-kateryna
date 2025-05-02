interface RestDto {
    productId: string;
    quantity: number;
    updatedAt?: string; 
  }
  

interface RestsResponse {
    rests: RestDto[];
}