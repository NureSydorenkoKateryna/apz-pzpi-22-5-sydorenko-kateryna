import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/providers/authProvider';
import { useAppDispatch } from '@/services/hooks';
import { updateRestQuantitySlice } from '@/services/products/slice';
import { useState } from 'react';

export default function ProductRestInput({ product }: { product: ProductWithRest }) {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const [restQuantity, setRestQuantity] = useState({
    id: product.id,
    quantity: product.rest?.quantity || 0,
  });
  const handleQuantityChange = (productId: number, quantity: number) => {
    setRestQuantity({ id: productId, quantity });
  };

  const handleRestEnter = (productId: number) => {
    const token = getToken();
    if (!token) return;
    dispatch(
      updateRestQuantitySlice({
        token,
        productId: productId,
        quantity: restQuantity.quantity,
      })
    );
  };

  return (
    <Input
      type="number"
      value={
        !restQuantity?.quantity || Number.isNaN(restQuantity?.quantity)
          ? ''
          : restQuantity?.quantity
      }
      className="w-24"
      onBlur={() => {
        handleRestEnter(product.id);
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          handleRestEnter(product.id);
        }
      }}
      onChange={e => handleQuantityChange(product.id, parseFloat(e.target.value))}
    />
  );
}
