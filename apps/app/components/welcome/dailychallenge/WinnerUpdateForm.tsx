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
      // Validate playback ID format and URL
      const playbackId = data.playback_id.trim();

      // Validate all required fields are present and properly formatted
      if (!data.user_full_name?.trim()) {
        throw new Error('Full name is required');
      }
      if (!data.pipeline_name?.trim()) {
        throw new Error('Pipeline name is required');
      }
      if (!data.prompt_used?.trim()) {
        throw new Error('Prompt is required');
      }
      if (!data.description?.trim()) {
        throw new Error('Description is required');
      }

      // Validate playback ID format and URL using example function logic
      if (!playbackId.match(/^[a-zA-Z0-9]{16}$/)) {
        throw new Error('Invalid playback ID format (must be exactly 16 characters)');
      }

      try {
        // Validate playback URL
        const response = await fetch(`https://lvpr.tv/${playbackId}`);
        if (!response.ok) {
          throw new Error('Invalid playback URL - video not found');
        }
      } catch (error) {
        console.error('Playback URL validation error:', error);
        throw new Error('Failed to validate playback URL - please check your internet connection');
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
        throw new Error('Rank must be a valid positive number');
      }

      await onSubmit?.(processedData);
      toast({
        title: 'Success',
        description: 'Winner updated successfully',
      });
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Failed to update winner',
        variant: 'destructive',
        duration: 5000,
        role: 'status',
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
