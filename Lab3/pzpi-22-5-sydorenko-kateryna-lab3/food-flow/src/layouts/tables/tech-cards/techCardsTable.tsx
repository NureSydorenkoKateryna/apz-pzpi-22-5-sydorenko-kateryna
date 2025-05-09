'use client';

import { useAuth } from '@/lib/providers/authProvider';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { fetchProductsWithRests, fetchUnits, selectProducts } from '@/services/products/slice';
import {
  fetchTechCards,
  selectTechCards,
  selectTechCardsLoading,
} from '@/services/tech-cards/slice';
import { useEffect } from 'react';

import { useTranslations } from 'next-intl';
import SpinnerContainer from '../../base/spinnerContainer';
import AddTechCardDialog from './addTechCard';
import TechCardRow from './techCardRow';

export default function TechCardTable() {
  const t = useTranslations('TechCardTable');
  const dispatch = useAppDispatch();
  const techCards = useAppSelector(selectTechCards);
  const isLoading = useAppSelector(selectTechCardsLoading);
  const products = useAppSelector(selectProducts);
  const { getToken } = useAuth();

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    dispatch(fetchTechCards(token));
    if (!products) {
      dispatch(fetchProductsWithRests(token));
      dispatch(fetchUnits(token));
    }
  }, []);

  if (isLoading) return <SpinnerContainer />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{t('techCards')}</h1>
        <AddTechCardDialog products={products || []} />
      </div>

      <div className="overflow-x-auto rounded-lg border shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-3">{t('id')}</th>
              <th className="px-6 py-3">{t('name')}</th>
              <th className="px-6 py-3 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {techCards.map(card => (
              <TechCardRow key={card.id} card={card} products={products || []} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
