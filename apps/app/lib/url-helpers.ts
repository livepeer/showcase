export function getWebRTCUrl(streamKey: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_AI_WEBRTC_BASE_URL;
  const whipPath = process.env.NEXT_PUBLIC_AI_WEBRTC_WHIP_PATH;

  if (!baseUrl || !whipPath) {
    throw new Error('Base URL or WHIP path is not defined in the environment variables.');
  }

  // Replace the placeholder in the WHIP path
  const resolvedWhipPath = whipPath.replace('%STREAM_KEY%', streamKey);

  return `${baseUrl}/${resolvedWhipPath}`;
}

export function getRtmpUrl(streamKey: string): string {
  const rtmpUrl = process.env.NEXT_PUBLIC_RTMP_URL;

  if (!rtmpUrl) {
    throw new Error('RTMP URL is not defined in the environment variables.');
  }

  return rtmpUrl.replace('%STREAM_KEY%', streamKey);
  // const separator = rtmpUrl.endsWith('/') ? '' : '/';
  // return rtmpUrl + separator + streamKey;
}
  