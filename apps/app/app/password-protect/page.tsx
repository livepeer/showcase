"use client"

import { useState, useEffect } from 'react';
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { useRouter } from 'next/navigation';

export default function PasswordProtect() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const CORRECT_PASSWORD = process.env.SITE_PASSWORD;
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
        <h2 className="text-2xl muted-text-foreground">
            Livepeer Pipelines are in closed beta. To get access, please join the{' '}
            <a 
              href="https://discord.gg/livepeer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Livepeer Discord server
            </a>
          </h2>
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