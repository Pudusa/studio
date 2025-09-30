'use server';

import { getProductRecommendations } from '@/ai/flows/ai-product-recommendations';
import { products } from '@/lib/data';

export async function getRecommendationsAction(browsingHistory: string[]) {
  if (!browsingHistory || browsingHistory.length === 0) {
    return { success: true, recommendations: products.slice(0,4) };
  }

  try {
    const result = await getProductRecommendations({ browsingHistory });
    const recommendedProductNames = result.recommendations;

    // Find full product objects from the names
    const recommendedProducts = recommendedProductNames.map(name => 
        products.find(p => p.name.toLowerCase() === name.toLowerCase())
    ).filter(Boolean);

    // If AI returns fewer than 4, fill with random products
    if (recommendedProducts.length < 4) {
        const existingIds = new Set(recommendedProducts.map(p => p!.id));
        const filler = products.filter(p => !existingIds.has(p.id))
            .slice(0, 4 - recommendedProducts.length);
        return { success: true, recommendations: [...recommendedProducts, ...filler] };
    }
    
    return { success: true, recommendations: recommendedProducts.slice(0, 4) };
  } catch (error) {
    console.error("AI recommendation error, returning fallback:", error);
    // Fallback to a few random products if AI fails
    return { success: true, recommendations: products.slice(4,8) };
  }
}
