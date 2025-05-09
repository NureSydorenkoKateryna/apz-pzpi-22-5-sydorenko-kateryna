'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/lib/providers/authProvider';
import { useAppDispatch } from '@/services/hooks';
import { createTechCard as createTechCardThunk, fetchTechCards } from '@/services/tech-cards/slice';
import { PlusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface Props {
  products: ProductDto[];
}

export default function AddTechCardDialog({ products }: Props) {
  const t = useTranslations('TechCardTable');
  const [open, setOpen] = useState(false);
  const [newCard, setNewCard] = useState<CreateTechCardRequest>({
    name: '',
    description: '',
    ingredients: [],
  });

  const [newIngredientId, setNewIngredientId] = useState('');
  const [newIngredientQty, setNewIngredientQty] = useState('');
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();

  const handleAddIngredient = () => {
    const product = products.find(p => p.id.toString() === newIngredientId);
    if (!product || !newIngredientQty) return;

    setNewCard(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          productId: product.id,
          quantity: parseFloat(newIngredientQty),
        },
      ],
    }));

    setNewIngredientId('');
    setNewIngredientQty('');
  };

  const handleSubmitNewCard = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const payload: CreateTechCardRequest = {
        name: newCard.name,
        description: newCard.description,
        ingredients: newCard.ingredients.map(
          (ing): CreateIngredientRequest => ({
            productId: ing.productId,
            quantity: ing.quantity,
          })
        ),
      };

      dispatch(createTechCardThunk({ token, data: payload }))
        .unwrap()
        .then(() => {
          dispatch(fetchTechCards(token));
        })
        .catch(err => {
          console.error('Failed to create tech card', err);
        });

      setNewCard({
        name: '',
        description: '',
        ingredients: [],
      });
      setOpen(false);
    } catch (err) {
      console.error('Failed to create tech card', err);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {' '}
        <PlusCircle className="w-8 h-8" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('createNewTechCard')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                value={newCard.name}
                onChange={e => setNewCard(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border px-3 py-2 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t('description')}</label>
              <textarea
                value={newCard.description}
                onChange={e => setNewCard(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border px-3 py-2 rounded text-sm"
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{t('ingredients')}</h4>
              {newCard.ingredients.map((ing, i) => {
                const product = products.find(p => p.id === ing.productId);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex-1">{product?.name}</span>
                    <span>
                      {ing.quantity} {product?.unit}
                    </span>
                  </div>
                );
              })}

              <div className="flex gap-2">
                <select
                  value={newIngredientId}
                  onChange={e => setNewIngredientId(e.target.value)}
                  className="flex-1 border px-2 py-1 rounded text-sm"
                >
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Qty"
                  value={newIngredientQty}
                  onChange={e => setNewIngredientQty(e.target.value)}
                  className="w-24 border px-2 py-1 rounded text-sm"
                />
                <Button size="sm" onClick={handleAddIngredient}>
                  {t('add')}
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleSubmitNewCard}>{t('save')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
