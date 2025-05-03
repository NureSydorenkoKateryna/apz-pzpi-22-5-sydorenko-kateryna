// store/productSlice.ts
import {
  createProducts as createProductsApi,
  deleteProduct as deleteProductApi,
  getProducts as fetchProductsApi,
  getUnits as fetchUnitsApi,
  updateProduct as updateProductApi,
} from '@/services/products/api';
import { getRests, updateRestQuantity as updateRestQuantityApi } from '@/services/rests/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';

interface ProductsState {
  products: ProductWithRest[];
  units: UnitDto[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  units: [],
  isLoading: false,
  error: null,
};

export const fetchProductsWithRests = createAsyncThunk<ProductWithRest[], string>(
  'products/fetchWithRests',
  async token => {
    const productsRes = await fetchProductsApi(token);
    const restsRes = await getRests(token);

    return productsRes.products.map(product => ({
      ...product,
      rest: restsRes.rests.find(r => r.productId === product.id.toString()) || null,
    }));
  }
);

export const fetchUnits = createAsyncThunk<UnitDto[], string>('units/fetchUnits', async token => {
  const response = await fetchUnitsApi(token);
  return response.units;
});

export const createProducts = createAsyncThunk<
  void,
  { token: string; data: CreateProductRequest[] }
>('products/create', async ({ token, data }) => {
  await createProductsApi(token, data);
});

export const updateProduct = createAsyncThunk<
  void,
  { token: string; productId: number; data: CreateProductRequest }
>('products/update', async ({ token, productId, data }) => {
  await updateProductApi(token, productId, data);
});

export const deleteProduct = createAsyncThunk<number, { token: string; productId: number }>(
  'products/delete',
  async ({ token, productId }) => {
    await deleteProductApi(token, productId);
    return productId;
  }
);

export const updateRestQuantitySlice = createAsyncThunk<
  void,
  { token: string; productId: number; quantity: number }
>('products/updateRestQuantity', async ({ token, productId, quantity }) => {
  await updateRestQuantityApi(token, productId, quantity);
});

const productSlice = createSlice({
  name: 'productsSlice',
  initialState,
  reducers: {
    updateRestQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const product = state.products.find(p => p.id === action.payload.productId);
      if (product?.rest) {
        product.rest.quantity = action.payload.quantity;
        product.rest.updatedAt = new Date().toISOString();
      }
    },
    setProductRests(state, action: PayloadAction<RestDto[]>) {
      const rests = action.payload;
      state.products = state.products.map(product => {
        const rest = rests.find(r => r.productId === product.id.toString()) || null;
        return {
          ...product,
          rest,
        };
      });
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProductsWithRests.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsWithRests.fulfilled, (state, action) => {
        state.products = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchProductsWithRests.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to load products';
        state.isLoading = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const { productId, data } = action.meta.arg;
        const product = state.products.find(p => p.id === productId);

        if (product) {
          state.products = state.products.map(p => (p.id === productId ? { ...p, ...data } : p));
        }
        toast.success('Product updated successfully', {
          description: 'The product has been updated.',
          action: {
            onClick: () => {},
            label: 'Ok',
          },
        });
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.units = action.payload;
      })
      .addCase(createProducts.fulfilled, () => {
        toast.success('Products created successfully', {
          description: 'The products have been added to the list.',
          action: {
            onClick: () => {},
            label: 'Ok',
          },
        });
      })
      .addCase(updateRestQuantitySlice.fulfilled, (state, action) => {
        const { productId, quantity } = action.meta.arg;
        const product = state.products.find(p => p.id === productId);
        if (product?.rest) {
          product.rest.quantity = quantity;
          product.rest.updatedAt = new Date().toLocaleDateString();
        }
      });
  },
});

export const { updateRestQuantity, setProductRests } = productSlice.actions;
export default productSlice;
