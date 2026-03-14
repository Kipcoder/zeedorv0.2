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
import { useToast } from '@/hooks/use-toast';

/**
 * LoginPage handles both Sign In and Sign Up for Zeedor.
 * It uses non-blocking Firebase Auth functions.
 */
export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading, userError } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to dashboard if user is already logged in
  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Surface auth errors if they occur
  React.useEffect(() => {
    if (userError) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: userError.message,
      });
      setIsSubmitting(false);
    }
  }, [userError, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (isSignUp) {
      // Non-blocking call to Firebase Auth
      initiateEmailSignUp(auth, email, password);
    } else {
      // Non-blocking call to Firebase Auth
      initiateEmailSignIn(auth, email, password);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl border-none shadow-xl overflow-hidden bg-white">
        <CardHeader className="bg-primary text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group justify-center relative z-10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Dumbbell className="text-primary h-6 w-6" />
            </div>
            <span className="text-2xl font-headline font-bold tracking-tight">Zeedor</span>
          </Link>
          <CardTitle className="text-2xl font-headline relative z-10">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-blue-100 relative z-10">
            {isSignUp ? 'Join the ultimate sports ecosystem today.' : 'Sign in to manage your sports journey.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                className="rounded-xl h-12 bg-gray-50 border-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                {!isSignUp && (
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs font-bold text-primary">
                    Forgot Password?
                  </Button>
                )}
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                className="rounded-xl h-12 bg-gray-50 border-gray-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-lg font-bold mt-4 shadow-lg shadow-primary/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
              {isSignUp ? 'Get Started' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="px-8 pb-8 pt-0 flex flex-col gap-4 text-center">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setIsSubmitting(false);
              }} 
              className="text-primary font-bold hover:underline transition-all"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
