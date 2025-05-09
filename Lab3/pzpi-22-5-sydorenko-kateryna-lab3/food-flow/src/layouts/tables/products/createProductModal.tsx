'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { createProducts, fetchProductsWithRests } from '@/services/products/slice';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Unit = {
  id: number;
  value: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  units: Unit[];
  unitsDictById: Record<number, string>;
  unitsDictByName: Record<string, number>;
};

export default function CreateProductModal({
  open,
  onClose,
  units,
  unitsDictById,
  unitsDictByName,
}: Props) {
  const t = useTranslations('ProductTable');
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const [productName, setProductName] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [shelfLifeDays, setShelfLifeDays] = useState(0);

  const handleCreate = () => {
    if (!productName || !selectedUnitId) return;
    const token = getToken();
    if (!token) return;
    const newProduct = {
      name: productName,
      unitId: selectedUnitId,
      shelfLifeDays,
    };
    dispatch(createProducts({ token, data: [newProduct] })).then(() => {
      dispatch(fetchProductsWithRests(token));
    });
    onClose();
    setProductName('');
    setSelectedUnitId(null);
    setShelfLifeDays(0);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('createProduct')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder={t('productName')}
            value={productName}
            onChange={e => setProductName(e.target.value)}
          />
          <Input
            type="number"
            placeholder={t('shelfLife')}
            value={shelfLifeDays ?? 0}
            onChange={e => setShelfLifeDays(parseInt(e.target?.value ?? '0'))}
          />
          <Select
            value={selectedUnitId ? unitsDictById[selectedUnitId] : ''}
            onValueChange={value => {
              setSelectedUnitId(unitsDictByName[value]);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('selectUnit')} />
            </SelectTrigger>
            <SelectContent>
              {units.map(unit => (
                <SelectItem key={unit.id} value={unit.value}>
                  {unit.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleCreate}>{t('save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
