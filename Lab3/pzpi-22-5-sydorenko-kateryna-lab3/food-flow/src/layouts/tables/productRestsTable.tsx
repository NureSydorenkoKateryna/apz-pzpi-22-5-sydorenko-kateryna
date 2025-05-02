'use client';

import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import useProductsService from '@/services/products/service';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export const mockProductsWithRests: ProductWithRest[] = [
  {
    id: 1,
    name: 'Flour',
    unit: 'kg',
    rest: {
      productId: '1',
      quantity: 120.5,
      updatedAt: '2025-04-30T10:15:00Z',
    },
  },
  {
    id: 2,
    name: 'Sugar',
    unit: 'kg',
    rest: {
      productId: '2',
      quantity: 85.2,
      updatedAt: '2025-04-30T09:00:00Z',
    },
  },
  {
    id: 3,
    name: 'Salt',
    unit: 'kg',
    rest: {
      productId: '3',
      quantity: 40,
      updatedAt: '2025-04-29T18:45:00Z',
    },
  },
  {
    id: 4,
    name: 'Olive Oil',
    unit: 'L',
    rest: {
      productId: '4',
      quantity: 30,
      updatedAt: '2025-04-29T12:30:00Z',
    },
  },
  {
    id: 5,
    name: 'Tomato Sauce',
    unit: 'L',
    rest: {
      productId: '5',
      quantity: 75,
      updatedAt: '2025-04-28T15:00:00Z',
    },
  },
  {
    id: 6,
    name: 'Rice',
    unit: 'kg',
    rest: null,
  },
  {
    id: 7,
    name: 'Pasta',
    unit: 'kg',
    rest: {
      productId: '7',
      quantity: 45.5,
      updatedAt: '2025-04-30T11:25:00Z',
    },
  },
  ...Array.from({ length: 100 }, (_, i) => ({
    id: i + 8,
    name: `Product ${i + 8}`,
    unit: 'kg',
    rest: {
      productId: (i + 8).toString(),
      quantity: Math.floor(Math.random() * 100),
      updatedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    },
  })),
];

export default function ProductTable() {
  const [products, setProducts] = useState<ProductWithRest[]>([]);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { getProductsWithRests } = useProductsService();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProductsWithRests().then(response => {
      setProducts(response);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-35">
        <Spinner />
      </div>
    );
  }

  const handleQuantityChange = async (productId: number, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const updatedRest = {
      productId: product.id.toString(),
      quantity,
    };

    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, rest: { ...updatedRest, updatedAt: new Date().toISOString() } }
          : p
      )
    );
  };

  const removeProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {/* Header: Search & Create Button */}
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

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Product Name" />
            <Input placeholder="Unit (e.g. kg, pcs)" />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowCreateModal(false)}>Save</Button>
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
                  <Input
                    type="number"
                    value={product.rest?.quantity ?? 0}
                    className="w-24"
                    onChange={e => handleQuantityChange(product.id, parseFloat(e.target.value))}
                  />
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
