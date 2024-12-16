"use server";

export async function updateParams(streamKey: string, body: any) {
  try {
    console.log("Stream key:", streamKey);
    console.log("Body:", body);

    const credentials = Buffer.from("").toString("base64");

    const response = await fetch(
      `https://origin.livepeer.monster/live/video-to-video/${streamKey}/update`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Success response:", data);
    return data;
  } catch (error) {
    console.error("Error in updateParams:", error);
    throw error;
  }
}
