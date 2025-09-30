'use client';

import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle subscription logic
  };

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Shop by Category</h3>
            <Link href="/electronics" className="text-muted-foreground hover:text-primary">
              Electronics
            </Link>
            <Link href="/home-kitchen" className="text-muted-foreground hover:text-primary">
              Home & Kitchen
            </Link>
            <Link href="/fashion" className="text-muted-foreground hover:text-primary">
              Fashion
            </Link>
            <Link href="/books" className="text-muted-foreground hover:text-primary">
              Books
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">About Us</h3>
            <Link href="/about" className="text-muted-foreground hover:text-primary">
              Our Story
            </Link>
            <Link href="/careers" className="text-muted-foreground hover:text-primary">
              Careers
            </Link>
            <Link href="/press" className="text-muted-foreground hover:text-primary">
              Press
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <Link href="/contact" className="text-muted-foreground hover:text-primary">
              Contact Us
            </Link>
            <Link href="/faq" className="text-muted-foreground hover:text-primary">
              FAQ
            </Link>
            <Link href="/shipping" className="text-muted-foreground hover:text-primary">
              Shipping & Returns
            </Link>
          </div>
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold">Don't miss out on anything.</h3>
            <p className="mt-2 text-muted-foreground">
              Be the first to know about our exclusive offers, new releases, and the best product recommendations.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <Input type="email" placeholder="Enter your email" required className="flex-1" />
              <Button type="submit">I want to subscribe!</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icons.logo className="h-5 w-5" />
            <span>&copy; {new Date().getFullYear()} Apex E-Commerce. All Rights Reserved.</span>
          </div>
          <div className="flex gap-4">
            <Link href="#" aria-label="Twitter">
              <Icons.twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Link>
            <Link href="#" aria-label="Facebook">
              <Icons.facebook className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Icons.instagram className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
