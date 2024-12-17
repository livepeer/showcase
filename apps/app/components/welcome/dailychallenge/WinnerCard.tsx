'use client';

import React from 'react';
import { Player } from '@livepeer/react';
import { cn } from '@repo/design-system/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@repo/design-system/components/ui/dialog';
import { GithubIcon, Discord as DiscordIcon } from 'lucide-react';
import { Spinner } from '@repo/design-system/components/ui/spinner';
import type { Winner } from './types';

interface WinnerCardProps {
  winner: Winner;
  className?: string;
}

export function WinnerCard({ winner, className }: WinnerCardProps) {
  const [isVideoLoading, setIsVideoLoading] = React.useState(true);
  const [videoError, setVideoError] = React.useState(false);

  const handleVideoError = () => {
    setVideoError(true);
    setIsVideoLoading(false);
  };

  return (
    <Card className={cn('w-full', className)} data-testid="winner-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{winner.user_full_name}</span>
            <Badge variant="outline">Rank #{winner.rank}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {winner.user_github && (
              <a
                href={`https://github.com/${winner.user_github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <GithubIcon className="h-4 w-4" />
                <span className="sr-only">@{winner.user_github}</span>
              </a>
            )}
            {winner.user_discord && (
              <span className="text-muted-foreground" title={winner.user_discord}>
                <DiscordIcon className="h-4 w-4" />
                <span className="sr-only">{winner.user_discord}</span>
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="aspect-video overflow-hidden rounded-lg relative">
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80" data-testid="video-loading">
                <Spinner className="h-6 w-6" />
              </div>
            )}
            {videoError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <p className="text-sm text-muted-foreground">Unable to load video</p>
              </div>
            ) : (
              <div data-testid="video-player">
                <Player
                  title={`Winner ${winner.user_full_name}'s submission`}
                  playbackId={winner.playback_id}
                  showPipButton
                  showTitle={false}
                  aspectRatio="16to9"
                  onError={handleVideoError}
                  onPlay={() => setIsVideoLoading(false)}
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Pipeline: {winner.pipeline_name}</h3>
            <p className="text-sm text-muted-foreground">{winner.description}</p>
            {winner.prompt_used && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">View Prompt</Button>
                </DialogTrigger>
                <DialogContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">Prompt Used</h4>
                    <p className="text-sm whitespace-pre-wrap">{winner.prompt_used}</p>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
