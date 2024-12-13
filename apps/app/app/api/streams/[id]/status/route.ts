import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";

const ERROR_MESSAGES = {
    UNAUTHORIZED: "Authentication required",
    INVALID_RESPONSE: "Invalid stream status response from Gateway",
    INTERNAL_ERROR: "An unexpected error occurred",
} as const;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const streamId = (await params).id;
    const username = process.env.STREAM_STATUS_ENDPOINT_USER;
    const password = process.env.STREAM_STATUS_ENDPOINT_PASSWORD;

    if (!username || !password) {
        return createErrorResponse(200, ERROR_MESSAGES.INTERNAL_ERROR + " - Missing auth credentials.");
    }

    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    try {
        console.log("Calling: ", `${process.env.STREAM_STATUS_ENDPOINT_URL}/${streamId}/status`)
        const response = await fetch(
            `${process.env.STREAM_STATUS_ENDPOINT_URL}/${streamId}/status`,
            {
                headers: {
                    Authorization: authHeader,
                    'cache-control': 'no-store',
                },
            }
        );

        if (!response.ok) {
            const responseMsg = await response.text().then((text) => text?.replace(/[\n\r]+/g, ' '));

            //handle 404 as state OFFLINE
            if(response.status === 404){
                return NextResponse.json({ success: true, error: null, data: {'state':'OFFLINE', info: responseMsg} }, { status: 200 });
            }
            return createErrorResponse(200, ERROR_MESSAGES.INVALID_RESPONSE + ` - [${response.status}] ${response.statusText} - ${responseMsg}`);
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
