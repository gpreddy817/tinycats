import { useAppSelector } from '@/app/hooks';
import { selectBreedsStatus, selectUsingFallback } from '@/features/breeds/breedsSlice';

export function useMCP() {
  const status = useAppSelector(selectBreedsStatus);
  const usingFallback = useAppSelector(selectUsingFallback);
  const isLoading = status === 'loading';

  return { isLoading, usingFallback };
}
