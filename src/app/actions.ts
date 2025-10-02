'use server';

import { getProductRecommendations } from '@/ai/flows/ai-product-recommendations';
import { supabase } from '@/lib/supabaseClient';
import type { Product } from '@/lib/types';

export async function getRecommendationsAction(browsingHistory: string[]) {
    // If there's no history, fetch some products directly from Supabase as a default
    if (!browsingHistory || browsingHistory.length === 0) {
        const { data, error } = await supabase.from('products').select('*, categories(slug)').limit(4);
        if (error) {
            console.error("Fallback recommendation error:", error);
            return { success: true, recommendations: [] };
        }
        // Map the category slug from the nested categories object
        const productsWithCategory = data.map((p: any) => ({
            ...p,
            category: p.categories.slug
        }));
        return { success: true, recommendations: productsWithCategory as Product[] };
    }

    try {
        const result = await getProductRecommendations({ browsingHistory });
        const recommendedProductNames = result.recommendations;

        // Find full product objects from the names
        const { data: products, error } = await supabase
            .from('products')
            .select('*, categories(slug)')
            .in('name', recommendedProductNames);

        if (error) throw error;

        const recommendedProducts = products.map((p: any) => ({
            ...p,
            category: p.categories.slug
        })) as Product[];

        // If AI returns fewer than 4, fill with other products
        if (recommendedProducts.length < 4) {
            const existingIds = new Set(recommendedProducts.map(p => p!.id));
            const { data: fillerData, error: fillerError } = await supabase
                .from('products')
                .select('*, categories(slug)')
                .not('id', 'in', `(${Array.from(existingIds).join(',')})`)
                .limit(4 - recommendedProducts.length);

            if (fillerError) throw fillerError;

            const fillerProducts = (fillerData || []).map((p: any) => ({
                ...p,
                category: p.categories.slug
            }));

            return { success: true, recommendations: [...recommendedProducts, ...fillerProducts] };
        }

        return { success: true, recommendations: recommendedProducts.slice(0, 4) };
    } catch (error) {
        console.error("AI recommendation error, returning fallback:", error);
        // Fallback to a few random products if AI fails
        const { data: fallbackData, error: fallbackError } = await supabase.from('products').select('*, categories(slug)').limit(4);
        if (fallbackError) {
            return { success: true, recommendations: [] };
        }
        const fallbackProducts = (fallbackData || []).map((p: any) => ({
            ...p,
            category: p.categories.slug
        }));
        return { success: true, recommendations: fallbackProducts as Product[] };
    }
}