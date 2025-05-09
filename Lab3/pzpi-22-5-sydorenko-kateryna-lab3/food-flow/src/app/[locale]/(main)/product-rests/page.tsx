import ProductTable from '@/layouts/tables/products/productRestsTable';
import ProtectedRoute from '@/lib/protectedRoute';

export default function ProductRests() {
  return (
    <ProtectedRoute allowedRoles={['Manager', 'Chef']}>
      <ProductTable />
    </ProtectedRoute>
  );
}
