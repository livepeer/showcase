"use server";

export async function updateParams(streamKey: string, body: any) {
  console.log("Stream key:", streamKey);
  console.log("Body:", body);
  const response = await fetch(
    `https://ai.livepeer.monster/live/video-to-video/${streamKey}/update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();
  console.log("Data:", data);
  return data;
}
