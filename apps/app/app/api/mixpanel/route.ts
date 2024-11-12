import { NextResponse } from "next/server";
const Mixpanel = require("mixpanel");

export async function POST(request: Request) {
  const mixpanel = Mixpanel.init(process.env.MIXPANEL_PROJECT_TOKEN);

  const data = await request.json();
  try {
    const { event, properties } = data;

    mixpanel.track(event, properties);

    return NextResponse.json({ status: "Event tracked successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
