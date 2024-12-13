import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";

const ERROR_MESSAGES = {
    UNAUTHORIZED: "Authentication required",
    INVALID_RESPONSE: "Invalid stream status response from Gateway",
    INTERNAL_ERROR: "An unexpected error occurred",
  } as const;

export async function GET(request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const streamId = (await params).id;
    const userId = request.headers.get("x-user-id");
    if (!userId) {
        return createErrorResponse(401, ERROR_MESSAGES.UNAUTHORIZED);
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STREAM_STATUS_ENDPOINT_URL}/${streamId}/status`);
        if (!response.ok) {
           return createErrorResponse(200, ERROR_MESSAGES.INVALID_RESPONSE + ` - [${response.status}] ${response.statusText}`);
        }
        const data = await response.json();
        return NextResponse.json({ success: true, error: null, data: data }, { status: 200 });
    } catch (error) {
        return createErrorResponse(500, ERROR_MESSAGES.INTERNAL_ERROR + " - " + error);
    }
}

function createErrorResponse(status: number, message: unknown) {
  return NextResponse.json({ success: false, error: message }, { status });
}



