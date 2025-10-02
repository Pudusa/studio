'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import type { Product } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import { ProductCard } from '@/components/product/product-card';
import { Skeleton } from '@/components/ui/skeleton';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!query) {
                setFilteredProducts([]);
                return;
            }

            setLoading(true);

            // We use 'ilike' for a case-insensitive search
            const { data, error } = await supabase
                .from('products')
                .select('*, categories(slug)')
                .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

            if (error) {
                console.error('Error fetching search results:', error);
                setFilteredProducts([]);
            } else {
                // We need to map the category slug from the nested categories object
                const productsWithCategory = data.map((p: any) => ({
                    ...p,
                    category: p.categories.slug
                }));
                setFilteredProducts(productsWithCategory as Product[]);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [query]);

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            {query ? (
                <>
                    <h1 className="text-3xl font-bold">
                        Search results for &quot;{query}&quot;
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {loading ? 'Searching...' : `${filteredProducts.length} results found.`}
                    </p>
                </>
            ) : (
                <h1 className="text-3xl font-bold">Search Products</h1>
            )}

            {loading ? (
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-6 w-1/4" />
                        </div>
                    ))}
                </div>
            ) : filteredProducts.length > 0 ? (
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