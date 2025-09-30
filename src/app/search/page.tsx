'use client';

import { useSearchParams } from 'next/navigation';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/product/product-card';
import { Suspense } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {query ? (
        <>
          <h1 className="text-3xl font-bold">
            Search results for &quot;{query}&quot;
          </h1>
          <p className="mt-2 text-muted-foreground">
            {filteredProducts.length} results found.
          </p>
        </>
      ) : (
        <h1 className="text-3xl font-bold">Search Products</h1>
      )}

      {filteredProducts.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 text-center">
          <p className="text-lg text-muted-foreground">No products found matching your search.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResults />
        </Suspense>
    )
}
