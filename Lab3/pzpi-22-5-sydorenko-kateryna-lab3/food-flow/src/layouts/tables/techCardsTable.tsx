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
import { useState } from 'react';

export const mockTechCards: TechCardDto[] = [
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
  const [selectedCard, setSelectedCard] = useState<TechCardDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState<TechCardDto | null>(null);

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
    if (editedCard) {
      console.log('Saved:', editedCard);
      setSelectedCard(editedCard); // update view
      // todo: update the original card in the list
      setIsEditing(false);
    }
  };

  const updateField = (key: keyof TechCardDto, value: unknown) => {
    if (!editedCard) return;
    setEditedCard(prev => ({ ...prev!, [key]: value }));
  };

  const updateIngredientAmount = (index: number, value: number) => {
    if (!editedCard) return;
    const updatedIngredients = [...editedCard.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], amount: value };
    setEditedCard(prev => ({ ...prev!, ingredients: updatedIngredients }));
  };

  const updateIngredientName = (index: number, value: string) => {
    if (!editedCard) return;
    const updatedIngredients = [...editedCard.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], name: value };
    setEditedCard(prev => ({ ...prev!, ingredients: updatedIngredients }));
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
            {mockTechCards.map(card => (
              <tr key={card.id} className="border-t">
                <td className="px-6 py-4">{card.id}</td>
                <td className="px-6 py-4">{card.name}</td>
                <td className="px-6 py-4 text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedCard(card)}>
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
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editedCard?.name}
                                onChange={e => updateField('name', e.target.value)}
                                className="w-full border px-3 py-2 rounded-md text-sm"
                              />
                            ) : (
                              <p className="text-sm">{selectedCard.name}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            {isEditing ? (
                              <textarea
                                value={editedCard?.description}
                                onChange={e => updateField('description', e.target.value)}
                                className="w-full border px-3 py-2 rounded-md text-sm"
                              />
                            ) : (
                              <p className="text-sm">{selectedCard.description}</p>
                            )}
                          </div>

                          <div>
                            <h3 className="font-semibold text-sm mb-2">Ingredients:</h3>
                            <ul className="space-y-2 text-sm">
                              {selectedCard.ingredients.map((ing, index) => (
                                <li
                                  key={ing.id}
                                  className="flex justify-between items-center gap-2 border-b py-1"
                                >
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={editedCard?.ingredients[index].name}
                                      onChange={e => updateIngredientName(index, e.target.value)}
                                      className="flex-1 border px-2 py-1 rounded"
                                    />
                                  ) : (
                                    <span className="flex-1">{ing.name}</span>
                                  )}

                                  {isEditing ? (
                                    <>
                                      <input
                                        type="number"
                                        value={editedCard?.ingredients[index].amount}
                                        onChange={e =>
                                          updateIngredientAmount(index, parseFloat(e.target.value))
                                        }
                                        className="w-20 border px-2 py-1 rounded"
                                      />
                                      <span>{ing.unit}</span>
                                    </>
                                  ) : (
                                    <span>
                                      {ing.amount} {ing.unit}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>

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
