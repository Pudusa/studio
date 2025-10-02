import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import type { Category, Product } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import { ProductCard } from '@/components/product/product-card';

export async function generateStaticParams() {
    const { data: categories, error } = await supabase.from('categories').select('slug');
    if (error || !categories) {
        return [];
    }
    return categories.map((category) => ({
        category: category.slug,
    }));
}

export default async function CategoryPage({ params }: { params?: { category?: string } }) {
    // Aplicamos tu solución: verificamos que el parámetro exista antes de usarlo.
    const slug = params?.category;
    if (!slug) {
        notFound();
    }

    // Primero, obtenemos los detalles de la categoría usando el slug validado.
    const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (categoryError || !categoryData) {
        notFound();
    }
    const category = categoryData as Category;

    // Después, usamos el ID de la categoría para buscar los productos.
    const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', category.id);

    if (productsError) {
        console.error('Error fetching products for category:', productsError);
    }

    const categoryProducts = productsData
        ? productsData.map(p => ({ ...p, category: category.slug })) as Product[]
        : [];

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