import React from 'react';

export const Player = ({ title, playbackId, onError, onPlay }: any) => {
  React.useEffect(() => {
    // Simulate video load
    setTimeout(() => {
      onPlay();
    }, 100);
  }, [onPlay]);

  return (
    <div data-testid="mock-player">
      <video src={`https://lvpr.tv/?v=${playbackId}`} title={title} />
    </div>
  );
};
