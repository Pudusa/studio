'use client';

import type { CartItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import React, { createContext, useReducer, useEffect, type ReactNode } from 'react';

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'SET_STATE'; payload: CartState }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };
    case 'UPDATE_QUANTITY': {
        if(action.payload.quantity <= 0) {
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload.id),
            }
        }
        return {
            ...state,
            items: state.items.map(item =>
                item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
            ),
        }
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_STATE':
        return action.payload;
    default:
      return state;
  }
};

type CartContextType = {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'apex-cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if(storedCart) {
            dispatch({ type: 'SET_STATE', payload: JSON.parse(storedCart) });
        }
    } catch (error) {
        console.error("Failed to load cart from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error("Failed to save cart to localStorage", error);
    }
  }, [state]);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
    });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateItemQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
