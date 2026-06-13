import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchBreedDetail, selectBreedById } from '@/features/breeds/breedsSlice';
import { selectRecommendations } from '@/features/recommendations/recommendationsSlice';
import { BreedDetail } from '@/features/breeds/BreedDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { RootState } from '@/app/store';

function NotFound() {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <span className="text-5xl">😿</span>
      <h1
        className="text-2xl font-bold"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
      >
        Breed not found
      </h1>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        That breed doesn't seem to exist in our catalog.
      </p>
      <Button id="not-found-browse-btn" variant="default" onClick={() => navigate('/browse')}>
        Browse All Breeds
      </Button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Skeleton style={{ height: '20px', width: '80px', marginBottom: '24px' }} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
        <div className="lg:col-span-3">
          <Skeleton style={{ height: '320px', borderRadius: '16px' }} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Skeleton style={{ height: '36px', width: '60%' }} />
          <Skeleton style={{ height: '18px', width: '80%' }} />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <Skeleton key={n} style={{ height: '60px', borderRadius: '12px' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BreedPage() {
  const { breedId } = useParams<{ breedId: string }>();
  const dispatch = useAppDispatch();
  const breed = useAppSelector((state: RootState) =>
    breedId ? selectBreedById(breedId)(state) : undefined
  );
  const recommendations = useAppSelector(selectRecommendations);
  const recommendation = recommendations.find((r) => r.breedId === breedId);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!breedId) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    if (breed) {
      setLoading(false);
      return;
    }

    void dispatch(fetchBreedDetail(breedId)).then((result) => {
      if (result.meta.requestStatus === 'rejected') {
        setNotFound(true);
      }
      setLoading(false);
    });
  }, [breedId, breed, dispatch]);

  if (loading) return <LoadingSkeleton />;
  if (notFound || !breed) return <NotFound />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>
      <BreedDetail breed={breed} recommendation={recommendation} />
    </div>
  );
}
