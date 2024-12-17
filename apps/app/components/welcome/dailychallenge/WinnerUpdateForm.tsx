'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@repo/design-system/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';
import { Button } from '@repo/design-system/components/ui/button';
import { winnerSchema, type Winner } from './schema';

interface WinnerUpdateFormProps {
  onSubmit?: (data: Winner) => void;
  defaultValues?: Partial<Winner>;
}

export function WinnerUpdateForm({ onSubmit, defaultValues }: WinnerUpdateFormProps) {
  const { toast } = useToast();
  const form = useForm<Winner>({
    resolver: zodResolver(winnerSchema),
    defaultValues: {
      user_full_name: '',
      user_github: '',
      user_discord: '',
      playback_id: '',
      pipeline_name: '',
      prompt_used: '',
      description: '',
      rank: 1,
      challenge_date: new Date().toISOString().split('T')[0],
      ...defaultValues,
    },
  });

  const { isSubmitting, isValidating } = form.formState;

  const handleSubmit = async (data: Winner) => {
    try {
      // Validate all required fields are present and properly formatted
      if (!data.user_full_name?.trim()) {
        form.setError('user_full_name', { message: 'Username is required' });
        return;
      }
      if (!data.pipeline_name?.trim()) {
        form.setError('pipeline_name', { message: 'Pipeline name is required' });
        return;
      }
      if (!data.prompt_used?.trim()) {
        form.setError('prompt_used', { message: 'Prompt is required' });
        return;
      }
      if (!data.description?.trim()) {
        form.setError('description', { message: 'Description is required' });
        return;
      }

      // Validate playback ID format
      const playbackId = data.playback_id.trim();
      if (!playbackId.match(/^[a-zA-Z0-9]{16}$/)) {
        form.setError('playback_id', { message: 'Invalid playback ID format (must be exactly 16 characters)' });
        return;
      }

      try {
        // Validate playback URL
        const response = await fetch(`https://lvpr.tv/${playbackId}`);
        if (!response.ok) {
          form.setError('playback_id', { message: 'Invalid playback ID. Stream not found.' });
          return;
        }
      } catch (error) {
        console.error('Playback URL validation error:', error);
        form.setError('playback_id', { message: 'Failed to validate playback URL' });
        return;
      }

      // Process and validate other fields
      const processedData = {
        ...data,
        rank: Number(data.rank),
        ...Object.entries(data)
          .filter(([key, value]) => typeof value === 'string')
          .reduce<Partial<Winner>>((acc, [key, value]) => ({
            ...acc,
            [key]: (value as string).trim(),
          }), {}),
      };

      if (isNaN(processedData.rank) || processedData.rank < 1) {
        form.setError('rank', { message: 'Rank must be a valid positive number' });
        return;
      }

      await onSubmit?.(processedData);
      form.reset();
      toast({
        title: 'Success',
        description: 'Winner updated successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update winners',
        variant: 'destructive',
      });
      throw error; // Re-throw to ensure test can catch the error
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="user_full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="user_full_name">Full Name</FormLabel>
              <FormControl>
                <Input id="user_full_name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user_github"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="user_github">GitHub Username</FormLabel>
              <FormControl>
                <Input id="user_github" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user_discord"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="user_discord">Discord ID</FormLabel>
              <FormControl>
                <Input id="user_discord" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="playback_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="playback_id">Playback ID</FormLabel>
              <FormControl>
                <Input id="playback_id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pipeline_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="pipeline_name">Pipeline Name</FormLabel>
              <FormControl>
                <Input id="pipeline_name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prompt_used"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="prompt_used">Prompt</FormLabel>
              <FormControl>
                <Input id="prompt_used" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <Input id="description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rank"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="rank">Rank</FormLabel>
              <FormControl>
                <Input
                  id="rank"
                  type="number"
                  min="1"
                  {...field}
                  value={field.value?.toString() || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : Number(e.target.value);
                    field.onChange(value);
                  }}
                  onBlur={() => {
                    const value = typeof field.value === 'undefined' ? 1 : Number(field.value);
                    field.onChange(isNaN(value) || value < 1 ? 1 : Math.floor(value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting || isValidating}
          className="w-full"
          data-testid="submit-winner-form"
        >
          {isSubmitting ? 'Saving...' : isValidating ? 'Validating...' : 'Save Winner'}
        </Button>
      </form>
    </Form>
  );
}
