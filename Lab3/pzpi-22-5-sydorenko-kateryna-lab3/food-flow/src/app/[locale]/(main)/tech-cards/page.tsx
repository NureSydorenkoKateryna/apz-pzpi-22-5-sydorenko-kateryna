import TechCardTable from '@/layouts/tables/tech-cards/techCardsTable';
import ProtectedRoute from '@/lib/protectedRoute';

export default function TechCards() {
  return (
    <ProtectedRoute allowedRoles={['Manager', 'Chef']}>
      <TechCardTable />
    </ProtectedRoute>
  );
}
