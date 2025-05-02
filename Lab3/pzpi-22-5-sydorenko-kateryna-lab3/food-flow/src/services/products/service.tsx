import { useAuth } from '@/lib/providers/authProvider';
import { toast } from 'sonner';
import { getRests } from '../rests/api';
import { getProducts as getProductsRequest } from './api';

export default function useProductsService() {
  const { getToken } = useAuth();

  const getProductsWithRests = async (): Promise<ProductWithRest[]> => {
    const token = getToken();
    const result: ProductWithRest[] = [];
    const products: ProductDto[] = [];
    await getProductsRequest(token || '')
      .then(response => {
        products.push(...response.products);
      })
      .catch(() => {
        toast.error('Failed to fetch products', {
          description: 'Please try again later.',
          action: {
            onClick: () => {
              getProductsWithRests();
            },
            label: 'Retry',
          },
        });
      });

    await getRests(token || '')
      .then(restsResponse => {
        const rests = restsResponse.rests;
        const productsWithRests = products.map(product => {
          const rest = rests.find(r => r.productId === product.id.toString());
          return {
            ...product,
            rest: rest || null, // Assign the found rest or null if not found
          };
        });
        result.push(...productsWithRests);
      })
      .catch(() => {
        toast.error('Failed to fetch rests', {
          description: 'Please try again later.',
          action: {
            onClick: () => {
              getProductsWithRests();
            },
            label: 'Retry',
          },
        });
      });

    return result;
  };

  const getProducts = async () => {
    const token = getToken();
    const result: ProductDto[] = [];
    await getProductsRequest(token || '')
      .then(response => {
        result.push(...response.products);
      })
      .catch(() => {
        toast.error('Failed to fetch products', {
          description: 'Please try again later.',
          action: {
            onClick: () => {
              getProducts();
            },
            label: 'Retry',
          },
        });
      });

    return result;
  };

  return {
    getProductsWithRests,
    getProducts,
  };
}
