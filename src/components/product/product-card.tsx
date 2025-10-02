'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';

import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();

    const productImage = product.images && product.images.length > 0
        ? PlaceHolderImages.find((img) => img.id === product.images[0])
        : null;

    const handleAddToCart = () => {
        if (product.images && product.images[0]) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.images[0],
                slug: product.slug,
                category: product.category,
            });
        }
    };

    return (
        <Card className="flex h-full flex-col overflow-hidden">
            <CardHeader className="p-0">
                <Link href={`/${product.category}/${product.slug}`}>
                    <div className="aspect-square relative w-full overflow-hidden">
                        {productImage ? (
                            <Image
                                src={productImage.imageUrl}
                                alt={product.name}
                                fill
                                // ¡AQUÍ ESTÁ EL CAMBIO!
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-300 hover:scale-105"
                                data-ai-hint={productImage.imageHint}
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <p className="text-muted-foreground">No image</p>
                            </div>
                        )}
                    </div>
                </Link>
            </CardHeader>
            <CardContent className="flex-1 p-4">
                <CardTitle className="mb-2 text-lg font-semibold leading-tight">
                    <Link href={`/${product.category}/${product.slug}`} className="hover:text-primary">
                        {product.name}
                    </Link>
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${
                                    i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted stroke-muted-foreground'
                                }`}
                            />
                        ))}
                    </div>
                    <span>({product.reviewCount})</span>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 pt-0">
                <p className="text-xl font-bold">{formatPrice(product.price)}</p>
                <Button onClick={handleAddToCart} size="sm" disabled={!product.images || product.images.length === 0}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}