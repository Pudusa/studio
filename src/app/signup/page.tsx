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

export default function SignupPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { toast } = useToast();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // You can store additional data like this
                data: {
                    first_name: firstName,
                    last_name: lastName,
                },
            },
        });

        if (error) {
            toast({
                title: "Error signing up",
                description: error.message,
                variant: "destructive",
            });
        } else if (data.user) {
            // Supabase sends a confirmation email by default.
            toast({
                title: "Success!",
                description: "Please check your email to confirm your account.",
            });
            // Redirect to the login page after successful sign-up
            router.push('/login');
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-background">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>Enter your information to create an account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp} className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input id="first-name" placeholder="Max" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full">
                            Create an account
                        </Button>
                        <Button variant="outline" className="w-full" disabled>
                            Sign up with Google
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}