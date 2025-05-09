'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/providers/authProvider';
import { useAppDispatch } from '@/services/hooks';
import { deleteProduct, fetchProductsWithRests, updateProduct } from '@/services/products/slice';
import { Trash2 } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';
import ProductRestInput from './productRestInput';

interface ProductTableRowProps {
  product: ProductWithRest;
  unitsDictByName: Record<string, number>;
  unitsDictById: Record<number, string>;
  units: UnitDto[];
}

export default function ProductTableRow({
  product,
  unitsDictById,
  unitsDictByName,
  units,
}: ProductTableRowProps) {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const t = useTranslations('ProductTable');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(product.name);
  const [editedUnitId, setEditedUnitId] = useState(
    units.find(u => u.value === product.unit)?.id || null
  );
  const format = useFormatter();

  const handleSave = async () => {
    const token = getToken();
    if (!token || !editedName || !editedUnitId) return;

    await dispatch(
      updateProduct({
        token,
        productId: product.id,
        data: {
          name: editedName,
          unitId: editedUnitId,
          shelfLifeDays: null,
        },
      })
    );

    dispatch(fetchProductsWithRests(token));
    setIsEditing(false);
  };

  const handleDelete = () => {
    const token = getToken();
    if (!token) return;
    dispatch(deleteProduct({ token, productId: product.id }));
  };

  return (
    <tr className="border-t hover:bg-muted/10 transition">
      <td className="px-4 py-2">
        {isEditing ? (
          <Input value={editedName} onChange={e => setEditedName(e.target.value)} />
        ) : (
          product.name
        )}
      </td>
      <td className="px-4 py-2">
        {isEditing ? (
          <Select
            value={editedUnitId ? unitsDictById[editedUnitId] : ''}
            onValueChange={value => setEditedUnitId(unitsDictByName[value])}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map(unit => (
                <SelectItem key={unit.id} value={unit.value}>
                  {unit.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          product.unit
        )}
      </td>
      <td className="px-4 py-2">
        <ProductRestInput product={product} />
      </td>
      <td className="px-4 py-2 text-muted-foreground text-xs">
        {product.rest?.updatedAt &&
          format.dateTime(new Date(product.rest.updatedAt), {
            dateStyle: 'short',
            timeStyle: 'short',
          })}
      </td>
      <td className="px-4 py-2 flex items-center gap-2">
        {isEditing ? (
          <>
            <Button size="sm" onClick={handleSave}>
              {t('save')}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
              {t('cancel')}
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
              {t('edit')}
            </Button>
            <Button variant="destructive" size="icon" className="h-8 w-8" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </td>
    </tr>
  );
}
