import React from 'react';

const Player = ({ title, playbackId }: { title: string; playbackId: string }) => {
  return (
    <div data-testid="mock-player">
      <div data-testid="video-loading" />
      <video data-testid="video-player" src={`https://lvpr.tv/?v=${playbackId}`} title={title} />
    </div>
  );
};

export { Player };
