'use client';

import React, { useState } from 'react';
import { useAuth, initiateEmailSignIn, initiateEmailSignUp, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dumbbell, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      initiateEmailSignUp(auth, email, password);
    } else {
      initiateEmailSignIn(auth, email, password);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl border-none shadow-xl overflow-hidden">
        <CardHeader className="bg-primary text-white p-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group justify-center">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Dumbbell className="text-primary h-6 w-6" />
            </div>
            <span className="text-2xl font-headline font-bold tracking-tight">Zeedor</span>
          </Link>
          <CardTitle className="text-2xl font-headline">{isSignUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
          <CardDescription className="text-blue-100">
            {isSignUp ? 'Join the ultimate sports ecosystem today.' : 'Sign in to manage your sports journey.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                className="rounded-xl h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="rounded-xl h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold mt-4 shadow-lg shadow-primary/20">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="px-8 pb-8 pt-0 flex flex-col gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-primary font-bold hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
