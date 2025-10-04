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
import { useEffect, useState } from 'react';

// Importaciones de Stripe
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

// Cargar la instancia de Stripe fuera del componente para no recargarla en cada render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// --- Componente del Formulario de Checkout ---
// Este componente manejará la lógica de pago y creación de pedido
function CheckoutForm({ totalAmount }: { totalAmount: number }) {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const { items, clearCart } = useCart();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [fullName, setFullName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements || !user) {
            // Stripe.js no ha cargado aún o el usuario no está logueado.
            return;
        }

        setIsLoading(true);

        // 1. Confirmar el pago con Stripe
        const { error: stripeError } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required', // No redirigir a otra página, manejamos el resultado aquí
        });

        if (stripeError) {
            toast({
                title: "Payment failed",
                description: stripeError.message,
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        // 2. Si el pago fue exitoso, crear el pedido en Supabase
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                total: totalAmount,
                status: 'Pending',
                customer_name: fullName,
                customer_email: user.email,
                user_id: user.id,
            })
            .select()
            .single();

        if (orderError) {
            // Si falla la creación del pedido, deberíamos idealmente reembolsar el pago.
            // Por ahora, solo mostraremos un error.
            console.error('Error creating order:', orderError);
            toast({
                title: "Error",
                description: "Payment succeeded, but failed to save your order. Please contact support.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        // 3. Guardar los artículos del pedido
        const orderItems = items.map(item => ({
            order_id: orderData.id,
            product_id: item.id,
            quantity: item.quantity,
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) {
            console.error('Error inserting order items:', itemsError);
            await supabase.from('orders').delete().eq('id', orderData.id); // Limpiar
            toast({
                title: "Error",
                description: "There was a problem saving your order details. Please contact support.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        // 4. Éxito total
        toast({
            title: "Order Placed!",
            description: "Your order has been placed successfully.",
        });

        clearCart();
        router.push('/account/orders');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
                <CardHeader><CardTitle>Shipping Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" required defaultValue={user?.email} disabled />
                    </div>
                    {/* ... otros campos de envío ... */}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Payment Details</CardTitle></CardHeader>
                <CardContent>
                    {/* El PaymentElement de Stripe renderiza el formulario de tarjeta */}
                    <PaymentElement />
                </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading || !stripe || !elements}>
                {isLoading ? "Processing..." : `Place Order - ${formatPrice(totalAmount)}`}
            </Button>
        </form>
    )
}


// --- Componente Principal de la Página de Checkout ---
export default function CheckoutPage() {
    const { items } = useCart();
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 5.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    useEffect(() => {
        if (items.length > 0) {
            // Crear la Intención de Pago en cuanto la página carga
            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: total }),
            })
                .then(res => res.json())
                .then(data => setClientSecret(data.clientSecret));
        }
    }, [items, total]);

    if (items.length === 0) {
        return (
            <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
                <h1 className="text-3xl font-bold">Your cart is empty</h1>
                <p className="text-muted-foreground">You can't checkout without any items.</p>
                <Button asChild><Link href="/">Continue Shopping</Link></Button>
            </div>
        )
    }

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: { theme: 'stripe' },
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="mb-8 text-center text-4xl font-bold">Checkout</h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    {/* El proveedor Elements debe envolver el formulario de pago */}
                    {clientSecret && (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm totalAmount={total} />
                        </Elements>
                    )}
                </div>

                <div className="md:col-span-1">
                    <Card>
                        <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {items.map((item) => {
                                const image = PlaceHolderImages.find((img) => img.id === item.image);
                                return (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                                            {image && <Image src={image.imageUrl} alt={item.name} fill className="object-cover" />}
                                            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{item.quantity}</span>
                                        </div>
                                        <div className="flex-1"><p className="font-medium">{item.name}</p></div>
                                        <p>{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                );
                            })}
                            <Separator />
                            <div className="space-y-2 text-muted-foreground">
                                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(shipping)}</span></div>
                                <div className="flex justify-between"><span>Taxes</span><span>{formatPrice(tax)}</span></div>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}