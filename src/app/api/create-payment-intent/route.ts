import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializa Stripe con tu clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20', // Usa la última versión de la API de Stripe
});

export async function POST(request: Request) {
    try {
        const { amount } = await request.json();

        if (amount === undefined || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        // Crea la Intención de Pago en Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // El monto debe estar en centavos
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // Devuelve la clave secreta del cliente al frontend
        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Internal Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}