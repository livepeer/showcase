// In apps/app/app/api/mixpanel/identify/route.ts
import { NextResponse } from "next/server";
const Mixpanel = require("mixpanel");

const mixpanel = Mixpanel.init(process.env.MIXPANEL_PROJECT_TOKEN);

export async function POST(request: Request) {
  const { distinct_id, anonymous_id } = await request.json();

  try {
    mixpanel.alias(distinct_id, anonymous_id);
    return NextResponse.json({ status: "User identified successfully" });
  } catch (error) {
    console.error("Error identifying user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}