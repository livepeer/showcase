import React from 'react';

interface PlayerProps {
  title?: string;
  playbackId: string;
  showPipButton?: boolean;
  showTitle?: boolean;
  aspectRatio?: string;
  onError?: () => void;
  onPlay?: () => void;
}

export const Player: React.FC<PlayerProps> = ({
  title,
  playbackId,
  onError,
  onPlay,
}) => {
  React.useEffect(() => {
    // Simulate video load completion
    const timer = setTimeout(() => {
      onPlay?.();
    }, 100);

    return () => clearTimeout(timer);
  }, [onPlay]);

  return (
    <div data-testid="mock-player">
      <video
        data-testid="video-player"
        src={`https://lvpr.tv/?v=${playbackId}`}
        title={title}
      />
    </div>
  );
};

export default { Player };
