'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/lib/providers/authProvider';
import { useAppDispatch } from '@/services/hooks';
import {
  deleteTechCard as deleteTechCardThunk,
  fetchTechCards,
  updateTechCard as updateTechCardThunk,
} from '@/services/tech-cards/slice';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface TechCardRowProps {
  card: TechCardDto;
  products: ProductDto[];
}

export default function TechCardRow({ card, products }: TechCardRowProps) {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const t = useTranslations('TechCardTable');

  const [selectedCard, setSelectedCard] = useState<TechCardDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState<TechCardDto | null>(null);
  const [nextIngredientId, setNextIngredientId] = useState(1000);
  const [newIngredientId, setNewIngredientId] = useState('');
  const [newIngredientQty, setNewIngredientQty] = useState('');

  const handleDelete = async () => {
    const token = getToken();
    if (!token || !selectedCard) return;
    dispatch(deleteTechCardThunk({ token, id: selectedCard.id }))
      .unwrap()
      .then(() => {
        dispatch(fetchTechCards(token));
        setSelectedCard(null);
        setIsEditing(false);
      })
      .catch(err => console.error('Error deleting tech card:', err));
  };

  const handleSave = async () => {
    const token = getToken();
    if (!editedCard || !token) return;

    const payload: CreateTechCardRequest = {
      name: editedCard.name,
      description: editedCard.description,
      ingredients: editedCard.ingredients.map(ing => ({
        productId: ing.productId,
        quantity: ing.amount,
      })),
    };

    dispatch(updateTechCardThunk({ token, id: editedCard.id, data: payload }))
      .unwrap()
      .then(() => {
        const token = getToken();
        if (!token) return;
        dispatch(fetchTechCards(token));
        setSelectedCard(null);
        setEditedCard(null);
      })
      .catch(err => console.error('Error updating tech card:', err));
  };

  const updateField = (key: keyof TechCardDto, value: unknown) => {
    if (!editedCard) return;
    setEditedCard(prev => ({ ...prev!, [key]: value }));
  };

  const updateIngredient = (index: number, key: keyof IngredientDto, value: unknown) => {
    if (!editedCard) return;
    const ingredients = [...editedCard.ingredients];
    ingredients[index] = { ...ingredients[index], [key]: value };
    setEditedCard(prev => ({ ...prev!, ingredients }));
  };

  const deleteIngredient = (id: number) => {
    if (!editedCard) return;
    const ingredients = editedCard.ingredients.filter(ing => ing.id !== id);
    setEditedCard(prev => ({ ...prev!, ingredients }));
  };

  const addIngredient = () => {
    if (!editedCard || !newIngredientId || !newIngredientQty) return;

    const product = products?.find(p => p.id.toString() === newIngredientId);
    if (!product) return;

    const newIngredient: IngredientDto = {
      id: nextIngredientId,
      productId: product.id,
      name: product.name,
      unit: product.unit,
      amount: parseFloat(newIngredientQty),
    };

    setEditedCard(prev => ({
      ...prev!,
      ingredients: [...prev!.ingredients, newIngredient],
    }));

    setNextIngredientId(prev => prev + 1);
    setNewIngredientId('');
    setNewIngredientQty('');
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditedCard({ ...card });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedCard(null);
  };

  return (
    <tr className="border-t">
      <td className="px-6 py-4">{card.id}</td>
      <td className="px-6 py-4">{card.name}</td>
      <td className="px-6 py-4 text-right space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCard(card);
                setIsEditing(false);
                setEditedCard(null);
              }}
            >
              {t('viewButton')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? t('editTechCard') : selectedCard?.name}</DialogTitle>
              {!isEditing && <DialogDescription>{selectedCard?.description}</DialogDescription>}
            </DialogHeader>

            {selectedCard && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">{t('nameLabel')}</label>
                  {isEditing ? (
                    <input
                      value={editedCard?.name}
                      onChange={e => updateField('name', e.target.value)}
                      className="w-full border px-3 py-2 rounded text-sm"
                    />
                  ) : (
                    <p>{selectedCard.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">{t('descriptionLabel')}</label>
                  {isEditing ? (
                    <textarea
                      value={editedCard?.description}
                      onChange={e => updateField('description', e.target.value)}
                      className="w-full border px-3 py-2 rounded text-sm"
                    />
                  ) : (
                    <p>{selectedCard.description}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">{t('ingredientsLabel')}</h3>
                  <ul className="space-y-2 text-sm">
                    {(isEditing ? editedCard! : selectedCard).ingredients.map((ing, index) => (
                      <li key={ing.id} className="flex items-center gap-2 border-b py-1">
                        {isEditing ? (
                          <>
                            <input
                              value={ing.name}
                              onChange={e => updateIngredient(index, 'name', e.target.value)}
                              className="flex-1 border px-2 py-1 rounded"
                            />
                            <input
                              type="number"
                              value={ing.amount}
                              onChange={e =>
                                updateIngredient(index, 'amount', parseFloat(e.target.value))
                              }
                              className="w-20 border px-2 py-1 rounded"
                            />
                            <span>{ing.unit}</span>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => deleteIngredient(ing.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1">{ing.name}</span>
                            <span>
                              {ing.amount} {ing.unit}
                            </span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {isEditing && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">{t('addIngredientLabel')}</h4>
                    <div className="flex gap-2">
                      <select
                        value={newIngredientId}
                        onChange={e => setNewIngredientId(e.target.value)}
                        className="flex-1 border px-2 py-1 rounded text-sm"
                      >
                        <option value="">{t('selectProductOption')}</option>
                        {products?.map(p => {
                          const isUsed = editedCard?.ingredients.some(i => i.productId === p.id);
                          return (
                            <option key={p.id} value={p.id} disabled={isUsed}>
                              {p.name} ({p.unit})
                            </option>
                          );
                        })}
                      </select>
                      <input
                        type="number"
                        placeholder={t('quantityPlaceholder')}
                        value={newIngredientQty}
                        onChange={e => setNewIngredientQty(e.target.value)}
                        className="w-24 border px-2 py-1 rounded text-sm"
                      />
                      <Button size="sm" onClick={addIngredient}>
                        {t('addButton')}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="destructive" onClick={handleDelete}>
                    {t('delete')}
                  </Button>
                  <div className="space-x-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={cancelEdit}>
                          {t('cancelButton')}
                        </Button>
                        <Button onClick={handleSave}>{t('save')}</Button>
                      </>
                    ) : (
                      <Button onClick={startEditing}>{t('edit')}</Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </td>
    </tr>
  );
}
