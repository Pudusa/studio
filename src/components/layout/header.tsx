'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Heart,
  Package,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, removeItem, updateItemQuantity, clearCart } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  // Mock authentication state
  const isAuthenticated = false;

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get('search') as string;
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="h-6 w-6" />
            <span className="font-bold">Apex</span>
          </Link>
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <SheetHeader>
                <Link href="/" className="flex items-center gap-2">
                    <Icons.logo className="h-6 w-6" />
                    <span className="font-bold">Apex</span>
                </Link>
            </SheetHeader>
            <div className="flex-1 py-4">
                <nav className="grid items-start gap-4 px-4 text-sm font-medium">
                    <Link href="/electronics">Electronics</Link>
                    <Link href="/home-kitchen">Home & Kitchen</Link>
                    <Link href="/fashion">Fashion</Link>
                    <Link href="/books">Books</Link>
                    <Link href="/about">About Us</Link>
                </nav>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex w-full items-center justify-between gap-4 md:justify-start">
            <nav className="hidden items-center gap-6 text-sm md:flex">
              <Link href="/electronics">Electronics</Link>
              <Link href="/home-kitchen">Home & Kitchen</Link>
              <Link href="/fashion">Fashion</Link>
              <Link href="/books">Books</Link>
            </nav>

            <div className="flex flex-1 items-center justify-end gap-2">
                <form onSubmit={handleSearch} className="relative hidden sm:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input name="search" placeholder="Search products..." className="pl-8 sm:w-[300px] lg:w-[400px]" />
                </form>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {itemCount}
                            </span>
                        )}
                        <span className="sr-only">Shopping Cart</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                        <SheetHeader className="px-6">
                        <SheetTitle>Shopping Cart ({itemCount})</SheetTitle>
                        </SheetHeader>
                        {items.length > 0 ? (
                        <>
                            <div className="flex-1 overflow-y-auto px-6">
                            <div className="flex flex-col gap-4">
                                {items.map((item) => {
                                const itemImage = PlaceHolderImages.find((img) => img.id === item.image);
                                return (
                                    <div key={item.id} className="flex items-start gap-4">
                                    {itemImage && (
                                        <Image
                                        src={itemImage.imageUrl}
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                        className="rounded-md object-cover"
                                        data-ai-hint="product image"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                                        <div className="mt-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</Button>
                                            <span className="w-6 text-center">{item.quantity}</span>
                                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</Button>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>Remove</Button>
                                        </div>
                                    </div>
                                    </div>
                                );
                                })}
                            </div>
                            </div>
                            <SheetFooter className="px-6 py-4">
                            <div className="flex w-full flex-col gap-4">
                                <div className="flex justify-between font-medium">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                                </div>
                                <Separator />
                                <Button asChild className="w-full">
                                <Link href="/checkout">Proceed to Checkout</Link>
                                </Button>
                                <Button variant="outline" onClick={() => {
                                    clearCart();
                                    toast({ title: "Cart cleared" });
                                }}>Clear Cart</Button>
                            </div>
                            </SheetFooter>
                        </>
                        ) : (
                        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                            <h3 className="text-xl font-semibold">Your cart is empty</h3>
                            <p className="text-muted-foreground">Add some products to get started.</p>
                            <SheetTrigger asChild>
                                <Button>Continue Shopping</Button>
                            </SheetTrigger>
                        </div>
                        )}
                    </SheetContent>
                </Sheet>

                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User Account</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {isAuthenticated ? (
                    <>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                        <Link href="/account">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                        <Link href="/account/orders">
                            <Package className="mr-2 h-4 w-4" />
                            <span>Orders</span>
                        </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                        <Link href="/account/wishlist">
                            <Heart className="mr-2 h-4 w-4" />
                            <span>Wishlist</span>
                        </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                        </DropdownMenuItem>
                    </>
                    ) : (
                    <>
                        <DropdownMenuLabel>Guest</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                        <Link href="/login">
                            <LogIn className="mr-2 h-4 w-4" />
                            <span>Log In</span>
                        </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                        <Link href="/signup">
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Sign Up</span>
                        </Link>
                        </DropdownMenuItem>
                    </>
                    )}
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

      </div>
    </header>
  );
}
