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
import { useAuth } from '@/lib/providers/authProvider';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import {
  createProducts,
  deleteProduct,
  fetchProductsWithRests,
  fetchUnits,
  setProductRests,
} from '@/services/products/slice';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import SpinnerContainer from '../base/spinnerContainer';
import ProductRestInput from './productRestInput';

const baseUrl = process.env.NEXT_PUBLIC_MOVEMENTS_API_URL || 'http://localhost:5000/api';
export default function ProductTable() {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const { products, isLoading, units } = useAppSelector(state => state.productsSlice);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [productName, setProductName] = useState('');
  const [shelfLifeDays, setShelfLifeDays] = useState(0);

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

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const source = new EventSource(`${baseUrl}/stream/rests/${token}`);

    source.onmessage = event => {
      const updatedRests = JSON.parse(event.data) as { rests: RestDto[] };
      dispatch(setProductRests(updatedRests.rests));
    };

    source.onerror = error => {
      console.error('SSE Error:', error);
      source.close();
    };

    return () => {
      source.close();
    };
  }, []);

  const removeProduct = (productId: number) => {
    const token = getToken();
    if (!token) return;
    dispatch(deleteProduct({ token, productId }));
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateProduct = () => {
    if (!productName || !selectedUnitId) return;
    const token = getToken();
    if (!token) return;
    const newProduct = {
      name: productName,
      unitId: selectedUnitId,
      shelfLifeDays: shelfLifeDays,
    };
    dispatch(createProducts({ token, data: [newProduct] })).then(() => {
      dispatch(fetchProductsWithRests(token));
    });
    setShowCreateModal(false);
  };

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
          + Create Product
        </Button>
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Product Name"
              value={productName}
              onChange={e => setProductName(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Shelf Life (days)"
              value={shelfLifeDays ?? 0}
              onChange={e => setShelfLifeDays(parseInt(e.target?.value ?? 0))}
            />

            <Select
              value={selectedUnitId ? unitsDictById[selectedUnitId] : ''}
              onValueChange={value => {
                setSelectedUnitId(unitsDictByNmae[value]);
              }}
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
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleCreateProduct();
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="rounded-2xl overflow-hidden border bg-card text-card-foreground shadow-sm mt-4">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 border-b text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Unit</th>
              <th className="px-4 py-3 font-medium">Rest</th>
              <th className="px-4 py-3 font-medium">Updated At</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="border-t hover:bg-muted/10 transition">
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.unit}</td>
                <td className="px-4 py-2">
                  <ProductRestInput product={product} />
                </td>
                <td className="px-4 py-2 text-muted-foreground text-xs">
                  {product.rest?.updatedAt && new Date(product.rest.updatedAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 ml-2"
                    onClick={() => removeProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
