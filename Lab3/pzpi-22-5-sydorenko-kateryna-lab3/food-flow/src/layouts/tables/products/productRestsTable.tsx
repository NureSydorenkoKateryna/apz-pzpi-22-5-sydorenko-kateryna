'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/providers/authProvider';

import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { fetchProductsWithRests, fetchUnits } from '@/services/products/slice';
import { PlusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import SpinnerContainer from '../../base/spinnerContainer';
import CreateProductModal from './createProductModal';
import ProductTableRow from './productTableRow';

export default function ProductTable() {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const { products, isLoading, units } = useAppSelector(state => state.productsSlice);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const t = useTranslations('ProductTable');

  const unitsDictByNmae = units.reduce((acc, unit) => {
    acc[unit.value] = unit.id;
    return acc;
  }, {} as Record<string, number>);
  const unitsDictById = units.reduce((acc, unit) => {
    acc[unit.id] = unit.value;
    return acc;
  }, {} as Record<number, string>);

  useEffect(() => {
    const token = getToken();
    if (token) {
      dispatch(fetchProductsWithRests(token));
      dispatch(fetchUnits(token));
    }
  }, [dispatch]);

  const filteredProducts = [...(products ?? [])]
    .sort((a, b) => a.name?.localeCompare(b?.name))
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) return <SpinnerContainer />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <Input
          placeholder="Search product..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:max-w-sm"
        />
        <Button onClick={() => setShowCreateModal(true)} className="h-10">
          <PlusCircle className="w-8 h-8" />
        </Button>
      </div>

      <CreateProductModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        units={units}
        unitsDictById={unitsDictById}
        unitsDictByName={unitsDictByNmae}
      />

      <div className="rounded-2xl overflow-hidden border bg-card text-card-foreground shadow-sm mt-4">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 border-b text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">{t("productName")}</th>
              <th className="px-4 py-3 font-medium">{t("unit")}</th>
              <th className="px-4 py-3 font-medium">{t("rest")}</th>
              <th className="px-4 py-3 font-medium">{t("updated_at")}</th>
              <th className="px-4 py-3 font-medium">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <ProductTableRow
                key={product.id}
                product={product}
                units={units}
                unitsDictById={unitsDictById}
                unitsDictByName={unitsDictByNmae}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
