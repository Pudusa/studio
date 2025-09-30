'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { products, categories } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, ChevronRight, ShoppingCart, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import AiRecommendations from '@/components/ai/recommendations';

export default function ProductPage({ params }: { params: { category: string; slug: string } }) {
  const { addItem } = useCart();
  const product = products.find((p) => p.slug === params.slug && p.category === params.category);
  const category = categories.find((c) => c.slug === params.category);

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // Add to browsing history for AI recommendations
    if (product) {
        const history = JSON.parse(localStorage.getItem('browsingHistory') || '[]');
        const newHistory = [window.location.href, ...history.filter((url: string) => url !== window.location.href)].slice(0, 5);
        localStorage.setItem('browsingHistory', JSON.stringify(newHistory));
    }
  }, [product]);

  if (!product || !category) {
    notFound();
  }

  const productImages = product.images.map(id => PlaceHolderImages.find(img => img.id === id)).filter(Boolean);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        image: product.images[0],
        price: product.price,
        quantity: 1,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/${category.slug}`} className="hover:text-primary">{category.name}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <div className="aspect-square relative w-full overflow-hidden rounded-lg">
            {productImages[activeImage] && (
              <Image
                src={productImages[activeImage]!.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={productImages[activeImage]!.imageHint}
                priority
              />
            )}
          </div>
          <div className="mt-4 grid grid-cols-5 gap-4">
            {productImages.map((img, index) => img && (
              <button
                key={img.id}
                onClick={() => setActiveImage(index)}
                className={`overflow-hidden rounded-md border-2 ${activeImage === index ? 'border-primary' : 'border-transparent'}`}
              >
                <Image
                  src={img.imageUrl}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className="aspect-square object-cover"
                  data-ai-hint={img.imageHint}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold md:text-4xl">{product.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted stroke-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
          </div>
          <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
          <Separator />
          <p className="text-muted-foreground">{product.description}</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button size="lg" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to cart
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="mr-2 h-5 w-5" />
              Add to my wish list
            </Button>
          </div>
          <Button size="lg" variant="secondary">
            Buy now
          </Button>
        </div>
      </div>

      <div className="mt-12 md:mt-16">
        <h2 className="text-2xl font-bold">You Might Also Like</h2>
        <AiRecommendations />
      </div>
    </div>
  );
}
