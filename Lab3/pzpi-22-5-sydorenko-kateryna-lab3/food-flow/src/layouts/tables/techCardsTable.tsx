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
import useProductsService from '@/services/products/service';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import SpinnerContainer from '../base/spinnerContainer';

const mockTechCards: TechCardDto[] = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with tomato sauce and mozzarella.',
    ingredients: [
      { id: 1, productId: 101, name: 'Flour', unit: 'g', amount: 300 },
      { id: 2, productId: 102, name: 'Tomato Sauce', unit: 'ml', amount: 150 },
      { id: 3, productId: 103, name: 'Mozzarella', unit: 'g', amount: 200 },
    ],
  },
  {
    id: 2,
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing and croutons.',
    ingredients: [
      { id: 4, productId: 201, name: 'Romaine Lettuce', unit: 'g', amount: 100 },
      { id: 5, productId: 202, name: 'Caesar Dressing', unit: 'ml', amount: 50 },
      { id: 6, productId: 203, name: 'Croutons', unit: 'g', amount: 30 },
    ],
  },
];

export default function TechCardTable() {
  const [techCards, setTechCards] = useState<TechCardDto[]>(mockTechCards);
  const [products, setProducts] = useState<ProductDto[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const { getProducts } = useProductsService();
  const [selectedCard, setSelectedCard] = useState<TechCardDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState<TechCardDto | null>(null);
  const [nextIngredientId, setNextIngredientId] = useState(1000);
  const [newIngredientId, setNewIngredientId] = useState('');
  const [newIngredientQty, setNewIngredientQty] = useState('');

  useEffect(() => {
    setIsLoading(true);
    getProducts()
      .then(data => {
        setProducts(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <SpinnerContainer />;
  }

  const startEditing = () => {
    if (selectedCard) {
      setIsEditing(true);
      setEditedCard({ ...selectedCard });
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedCard(null);
  };

  const saveEdit = () => {
    if (!editedCard) return;
    setTechCards(prev => prev.map(card => (card.id === editedCard.id ? editedCard : card)));
    setSelectedCard(editedCard);
    setIsEditing(false);
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

    const product = products.find(p => p.id.toString() === newIngredientId);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tech Cards</h1>

      <div className="overflow-x-auto rounded-lg border shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {techCards.map(card => (
              <tr key={card.id} className="border-t">
                <td className="px-6 py-4">{card.id}</td>
                <td className="px-6 py-4">{card.name}</td>
                <td className="px-6 py-4 text-right">
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
                        View
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {isEditing ? 'Edit Tech Card' : selectedCard?.name}
                        </DialogTitle>
                        {!isEditing && (
                          <DialogDescription>{selectedCard?.description}</DialogDescription>
                        )}
                      </DialogHeader>

                      {selectedCard && (
                        <div className="mt-4 space-y-4">
                          {/* Name */}
                          <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editedCard?.name}
                                onChange={e => updateField('name', e.target.value)}
                                className="w-full border px-3 py-2 rounded text-sm"
                              />
                            ) : (
                              <p className="text-sm">{selectedCard.name}</p>
                            )}
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            {isEditing ? (
                              <textarea
                                value={editedCard?.description}
                                onChange={e => updateField('description', e.target.value)}
                                className="w-full border px-3 py-2 rounded text-sm"
                              />
                            ) : (
                              <p className="text-sm">{selectedCard.description}</p>
                            )}
                          </div>

                          {/* Ingredients */}
                          <div>
                            <h3 className="font-semibold text-sm mb-2">Ingredients:</h3>
                            <ul className="space-y-2 text-sm">
                              {(isEditing
                                ? editedCard ?? selectedCard
                                : selectedCard
                              ).ingredients.map((ing, index) => (
                                <li key={ing.id} className="flex items-center gap-2 border-b py-1">
                                  {isEditing ? (
                                    <>
                                      <input
                                        type="text"
                                        value={ing.name}
                                        onChange={e =>
                                          updateIngredient(index, 'name', e.target.value)
                                        }
                                        className="flex-1 border px-2 py-1 rounded"
                                      />
                                      <input
                                        type="number"
                                        value={ing.amount}
                                        onChange={e =>
                                          updateIngredient(
                                            index,
                                            'amount',
                                            parseFloat(e.target.value)
                                          )
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

                          {/* Add Ingredient */}
                          {isEditing && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">Add Ingredient</h4>
                              <div className="flex gap-2">
                                <select
                                  value={newIngredientId}
                                  onChange={e => setNewIngredientId(e.target.value)}
                                  className="flex-1 border px-2 py-1 rounded text-sm"
                                >
                                  <option value="">Select Product</option>
                                  {products.map(p => {
                                    const isUsed = editedCard?.ingredients.some(
                                      i => i.productId === p.id
                                    );
                                    return (
                                      <option key={p.id} value={p.id} disabled={isUsed}>
                                        {p.name} ({p.unit}) {isUsed ? '✓' : ''}
                                      </option>
                                    );
                                  })}
                                </select>
                                <input
                                  type="number"
                                  placeholder="Quantity"
                                  value={newIngredientQty}
                                  onChange={e => setNewIngredientQty(e.target.value)}
                                  className="w-24 border px-2 py-1 rounded text-sm"
                                />
                                <Button size="sm" onClick={addIngredient}>
                                  Add
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-2 pt-4">
                            {isEditing ? (
                              <>
                                <Button variant="outline" onClick={cancelEdit}>
                                  Cancel
                                </Button>
                                <Button onClick={saveEdit}>Save</Button>
                              </>
                            ) : (
                              <Button onClick={startEditing}>Edit</Button>
                            )}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
