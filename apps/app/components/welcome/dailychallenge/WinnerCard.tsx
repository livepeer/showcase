'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@repo/design-system/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@repo/design-system/components/ui/dialog';
import { GithubIcon, MessageCircle as DiscordIcon } from 'lucide-react';
import { Spinner } from '@repo/design-system/components/ui/spinner';
import type { Winner } from './types';
import { Src } from '@livepeer/react';

// Dynamically import Player to avoid SSR issues
const Player = dynamic(
  () => import('@livepeer/react/player').then((mod) => mod.Root),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

interface WinnerCardProps {
  winner: Winner;
  className?: string;
}

export const WinnerCard: React.FC<WinnerCardProps> = ({ winner, className }) => {
  const [isVideoLoading, setIsVideoLoading] = React.useState(true);
  const [videoError, setVideoError] = React.useState(false);

  const handleVideoError = () => {
    setVideoError(true);
    setIsVideoLoading(false);
  };

  // Construct the video source for the Player
  const videoSource = React.useMemo((): Src[] | null => {
    if (!winner.playback_id) return null;
    return [{
      type: 'hls',
      src: `https://livepeercdn.com/hls/${winner.playback_id}/index.m3u8`,
      mime: 'application/vnd.apple.mpegurl',
      width: null,
      height: null,
    }];
  }, [winner.playback_id]);

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
                  src={videoSource}
                  aspectRatio={16/9}
                  hotkeys={false}
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
