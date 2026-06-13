import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { selectCompareList, fetchBreeds, selectBreedsStatus } from '@/features/breeds/breedsSlice';
import { CompareView } from '@/features/breeds/CompareView';

export default function ComparePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const compareList = useAppSelector(selectCompareList);
  const breedsStatus = useAppSelector(selectBreedsStatus);

  // Load breeds if not loaded
  useEffect(() => {
    if (breedsStatus === 'idle') {
      void dispatch(fetchBreeds());
    }
  }, [dispatch, breedsStatus]);

  // Redirect if compare list is empty
  useEffect(() => {
    if (compareList.length === 0) {
      navigate('/browse', { replace: true });
    }
  }, [compareList, navigate]);

  if (compareList.length === 0) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>
      <CompareView />
    </div>
  );
}
