'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { getRecommendationsAction } from '@/app/actions';
import { ProductCard } from '@/components/product/product-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AiRecommendations() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      const history = JSON.parse(localStorage.getItem('browsingHistory') || '[]');
      const result = await getRecommendationsAction(history);
      
      if (result.success && result.recommendations) {
        setRecommendations(result.recommendations as Product[]);
      }
      setLoading(false);
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
            </div>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return <p className="mt-6 text-muted-foreground">No recommendations available at the moment.</p>;
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recommendations.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
