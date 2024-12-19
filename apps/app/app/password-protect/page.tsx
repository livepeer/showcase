"use client"

import { useState, useEffect } from 'react';
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { useRouter } from 'next/navigation';

export default function PasswordProtect() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const CORRECT_PASSWORD = 'realtimeAIpipelines';
  const LOCAL_STORAGE_KEY = 'isVerified';

  useEffect(() => {
    // Check if already verified
    const isVerified = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (isVerified === 'true') {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (password === CORRECT_PASSWORD) {
        
        // Set cookie with all necessary attributes
        document.cookie = `isVerified=true; path=/; SameSite=Strict; secure=${window.location.protocol === 'https:'}`;
        
        // Small delay to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 100));
     
        // Force a hard refresh to the home page
        window.location.replace('/');
      } else {
        setError('Incorrect password');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Password Required</h2>
          <p className="mt-2 text-muted-foreground">Please enter the password to access the site</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
} 