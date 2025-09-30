import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { categories, products } from '@/lib/data';
import { ProductCard } from '@/components/product/product-card';

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = categories.find((c) => c.slug === params.category);
  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter((p) => p.category === category.slug);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{category.name}</span>
      </div>
      
      <div className="mt-6">
        <h1 className="text-4xl font-bold">{category.name}</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">{category.description}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categoryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
