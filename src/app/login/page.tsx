'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast({
                title: "Error signing in",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Success!",
                description: "You have successfully logged in.",
            });
            // Redirect to the homepage after successful login
            router.push('/');
            router.refresh(); // Refresh the page to update the header state
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-background">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                        <Button variant="outline" className="w-full" disabled>
                            Login with Google
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}