"use server";

import { createServerClient } from "@repo/supabase";
import { Livepeer } from "livepeer";

export async function deleteStream(streamId: string) {
    const supabase = await createServerClient();
    const { data, error } = await supabase
    .from("streams")
    .delete()
    .eq('id', streamId);
    if(!error){
        deleteLivepeerStream(streamId);
    }
    return { data, error: error?.message };
}

export const deleteLivepeerStream = async (name: string) => {
  try{
    
    const livepeer = new Livepeer({
      serverURL: "https://livepeer.monster/api",
      apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_API_KEY,
    });

    const { error } = await livepeer.stream.delete(name);

    return { error };
  }catch(e: any){
    console.error("Error deleting livepeer stream:", e);
    return {stream: null, error: e.message};
  }
};