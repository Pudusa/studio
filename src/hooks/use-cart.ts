'use client';

import { useContext } from 'react';
import { CartContext } from '@/context/cart-context';

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  const { state, ...rest } = context;

  return {
    items: state.items,
    ...rest,
  };
};
