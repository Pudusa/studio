import Link from 'next/link';
import Image from 'next/image';
import { categories, products } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ProductCard } from '@/components/product/product-card';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');
  const promoImage = PlaceHolderImages.find((img) => img.id === 'promo-banner-1');
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <section className="relative h-[50vh] min-h-[400px] w-full text-white md:h-[60vh]">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
          <h1 className="text-4xl font-bold md:text-6xl">
            Your world, just a click away.
          </h1>
          <p className="max-w-2xl text-lg text-neutral-200 md:text-xl">
            Find everything you need, from technology to fashion, and get it
            delivered to your door.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/#categories">Shop Now</Link>
          </Button>
        </div>
      </section>

      <section id="categories" className="container mx-auto px-4">
        <h2 className="mb-6 text-center text-3xl font-bold">
          Popular Categories
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((category) => {
            const categoryImage = PlaceHolderImages.find(
              (img) => img.id === category.image
            );
            return (
              <Link
                href={`/${category.slug}`}
                key={category.id}
                className="group relative block overflow-hidden rounded-lg"
              >
                {categoryImage && (
                  <Image
                    src={categoryImage.imageUrl}
                    alt={category.name}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={categoryImage.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">
                    {category.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">See today's deals</h2>
            <Button variant="outline" asChild>
                <Link href="/deals">Explore discounts <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="mt-6 w-full"
        >
          <CarouselContent>
            {featuredProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
        </Carousel>
      </section>

      <section className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-lg bg-primary/10 p-8 md:p-12">
            {promoImage && (
                <Image 
                    src={promoImage.imageUrl}
                    alt={promoImage.description}
                    fill
                    className="object-cover opacity-10"
                    data-ai-hint={promoImage.imageHint}
                />
            )}
            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <h2 className="text-3xl font-bold text-primary-foreground">Offers you can't miss</h2>
                <p className="max-w-xl text-primary-foreground/80">Up to 50% off thousands of select products. For a limited time only!</p>
                <Button asChild size="lg" className="mt-2">
                    <Link href="/deals">View All Offers</Link>
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
