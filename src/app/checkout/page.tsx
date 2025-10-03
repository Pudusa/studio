'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Lock } from 'lucide-react';

export default function CheckoutPage() {
    const { items, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 5.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    if (items.length === 0) {
        return (
            <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
                <h1 className="text-3xl font-bold">Your cart is empty</h1>
                <p className="text-muted-foreground">You can't checkout without any items.</p>
                <Button asChild>
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
        )
    }

    const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) {
            toast({
                title: "Authentication Error",
                description: "You must be logged in to place an order.",
                variant: "destructive",
            });
            router.push('/login');
            return;
        }

        // 1. Insert into the 'orders' table
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                total: total,
                status: 'Pending',
                customer_name: e.currentTarget.name,
                customer_email: user.email,
                // You can add a user_id column to your orders table to link it to the auth.users table
                // user_id: user.id
            })
            .select()
            .single();

        if (orderError) {
            console.error('Error creating order:', orderError);
            toast({
                title: "Error",
                description: "There was a problem placing your order. Please try again.",
                variant: "destructive",
            });
            return;
        }

        // 2. Prepare items for the 'order_items' table
        const orderItems = items.map(item => ({
            order_id: orderData.id,
            product_id: item.id,
            quantity: item.quantity,
        }));

        // 3. Insert into the 'order_items' table
        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) {
            console.error('Error inserting order items:', itemsError);
            // Here you might want to delete the created order to avoid inconsistencies
            await supabase.from('orders').delete().eq('id', orderData.id);
            toast({
                title: "Error",
                description: "There was a problem saving your order details. Please try again.",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Order Placed!",
            description: "Your order has been placed successfully.",
        });

        clearCart();
        router.push('/account/orders');
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="mb-8 text-center text-4xl font-bold">Checkout</h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <form onSubmit={handlePlaceOrder} className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" placeholder="John Doe" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="you@example.com" required defaultValue={user?.email} disabled />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" placeholder="123 Main St" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" placeholder="Anytown" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input id="state" placeholder="CA" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip">ZIP Code</Label>
                                    <Input id="zip" placeholder="12345" required />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative space-y-2">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <CreditCard className="absolute bottom-2.5 left-3 h-5 w-5 text-muted-foreground" />
                                    <Input id="card-number" placeholder="•••• •••• •••• ••••" className="pl-10" required />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiry</Label>
                                        <Input id="expiry" placeholder="MM/YY" required />
                                    </div>
                                    <div className="relative space-y-2 col-span-2">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Lock className="absolute bottom-2.5 left-3 h-5 w-5 text-muted-foreground" />
                                        <Input id="cvc" placeholder="•••" className="pl-10" required />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Button type="submit" size="lg" className="w-full">
                            Place Order
                        </Button>
                    </form>
                </div>

                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.map((item) => {
                                const image = PlaceHolderImages.find((img) => img.id === item.image);
                                return (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                                            {image && <Image src={image.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint={image.imageHint} />}
                                            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{item.quantity}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{item.name}</p>
                                        </div>
                                        <p>{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                );
                            })}
                            <Separator />
                            <div className="space-y-2 text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>{formatPrice(shipping)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Taxes</span>
                                    <span>{formatPrice(tax)}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}