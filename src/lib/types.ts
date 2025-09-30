import type { StaticImageData } from "next/image";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  images: string[];
  price: number;
  description: string;
  rating: number;
  reviewCount: number;
  tags: string[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
};

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
};


export type Order = {
    id: string;
    date: string;
    total: number;
    status: 'Pending' | 'Shipped' | 'Delivered';
    items: CartItem[];
};
