import { createAdminServerClient } from "@repo/supabase";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createAdminServerClient();

    // Check if tables exist
    const { error: checkError } = await supabase
      .from('daily_challenges')
      .select('id')
      .limit(1);

    // Only create tables if they don't exist (error code PGRST116 means relation not found)
    if (checkError?.code === 'PGRST116') {
      // Create tables using raw SQL through Supabase's SQL function
      const { error: createError } = await supabase.rpc('exec_sql', {
        query: `
          CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

          CREATE TABLE IF NOT EXISTS daily_challenges (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            prompt TEXT NOT NULL,
            start_date TIMESTAMP WITH TIME ZONE NOT NULL,
            end_date TIMESTAMP WITH TIME ZONE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS challenge_winners (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            challenge_id UUID REFERENCES daily_challenges(id),
            stream_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            playback_id TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            FOREIGN KEY (stream_id) REFERENCES streams(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
          );
        `
      });

      if (createError) {
        console.error('Error creating tables:', createError);
        if (createError.message.includes('permission denied')) {
          return NextResponse.json(
            { error: 'Insufficient permissions to create tables' },
            { status: 403 }
          );
        }
        return NextResponse.json(
          { error: 'Failed to create tables', details: createError },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: 'Tables created successfully' });
    }

    return NextResponse.json({ message: 'Tables already exist' });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}
