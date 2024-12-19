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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
      document.cookie = 'isVerified=true; path=/';
      router.push('/');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Password Required</h2>
          <p className="mt-2 text-gray-600">Please enter the password to access the site</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
} 