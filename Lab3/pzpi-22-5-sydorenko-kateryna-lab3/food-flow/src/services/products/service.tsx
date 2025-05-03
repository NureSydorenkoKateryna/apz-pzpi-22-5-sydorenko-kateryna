import { useAuth } from '@/lib/providers/authProvider';
import { toast } from 'sonner';
import { getRests } from '../rests/api';
import {
  createProducts as createProductsRequest,
  deleteProduct as deleteProductRequest,
  getProducts as getProductsRequest,
  getUnits as getUnitsRequest,
  updateProduct as updateProductRequest,
} from './api';

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

  const getUnits = async () => {
    const token = getToken();
    const result: UnitDto[] = [];
    await getUnitsRequest(token || '')
      .then(response => {
        result.push(...response.units);
      })
      .catch(() => {
        toast.error('Failed to fetch units', {
          description: 'Please try again later.',
          action: {
            onClick: () => {
              getUnits();
            },
            label: 'Retry',
          },
        });
      });
    return result;
  };

  const deleteProduct = async (productId: number) => {
    const token = getToken();
    await deleteProductRequest(token || '', productId)
      .then(() => {
        toast.success('Product deleted successfully', {
          description: 'The product has been removed from the list.',
          action: {
            onClick: () => {
              getProductsWithRests();
            },
            label: 'Ok',
          },
        });
      })
      .catch(() => {
        toast.error('Failed to delete product', {
          description: 'Please try again later.',
          action: {
            onClick: () => {
              deleteProduct(productId);
            },
            label: 'Retry',
          },
        });
      });
  };

  const createProducts = async (data: CreateProductRequest[]) => {
    const token = getToken();
    await createProductsRequest(token || '', data)
      .then(() => {
        toast.success('Products created successfully', {
          description: 'The products have been added to the list.',
          action: {
            onClick: () => {
              getProductsWithRests();
            },
            label: 'Ok',
          },
        });
      })
      .catch(() => {
        toast.error('Failed to create products', {
          description: 'Please try again later.',
          action: {
            onClick: () => {
              createProducts(data);
            },
            label: 'Retry',
          },
        });
      });
  };

  const updateProduct = async (productId: number, data: CreateProductRequest) => {
    const token = getToken();
    await updateProductRequest(token || '', productId, data)
      .then(() => {
        toast.success('Product updated successfully', {
          description: 'The product has been updated.',
          action: {
            onClick: () => {
              getProductsWithRests();
            },
            label: 'Ok',
          },
        });
      })
      .catch(() => {
        toast.error('Failed to update product', {
          description: 'Please try again later.',
          action: {
            onClick: () => {
              updateProduct(productId, data);
            },
            label: 'Retry',
          },
        });
      });
  };

  return {
    getProductsWithRests,
    getProducts,
    getUnits,
    deleteProduct,
    createProducts,
    updateProduct,
  };
}
