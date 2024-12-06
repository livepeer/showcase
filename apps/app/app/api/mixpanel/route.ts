import { NextResponse } from "next/server";
import crypto from 'crypto';
const Mixpanel = require("mixpanel");

const mixpanel = Mixpanel.init(process.env.MIXPANEL_PROJECT_TOKEN);

async function getGeoData(ip: string) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    return {
      $city: data.city,
      $region: data.regionName,
      mp_country_code: data.countryCode,
      $latitude: data.lat,
      $longitude: data.lon,
    };
  } catch (error) {
    console.error('Error getting geolocation:', error);
    return {};
  }
}

async function getDistinctId(ip: string, userAgent: string) {
  if (!ip || !userAgent) {
    return null;
  }
  
  const stringToHash = JSON.stringify({ ip, userAgent });
  const hash = crypto.createHash('md5').update(stringToHash).digest('hex');
  
  return hash;
}

export async function POST(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const userId = request.headers.get('x-user-id');
  
  const ip = process.env.NODE_ENV === 'development' 
    ? '93.152.210.100'  // Hardcoded development IP (truncated ip that resolves to San Francisco)
    : forwardedFor 
      ? forwardedFor.split(',')[0].trim() 
      : '127.0.0.1';

  let geoData = {};
  if (ip && ip !== '127.0.0.1' && ip !== '::1') {
    geoData = await getGeoData(ip);
  }

  const data = await request.json();
  const userAgent = data.properties.user_agent;
  
  const distinctId = userId || await getDistinctId(ip, userAgent);
  
  try {
    const { event, properties } = data;
    const enrichedProperties = {
      ...properties,
      ...geoData,
      distinct_id: distinctId,
      $user_id: userId || undefined,
    };

    console.log('Enriched Properties:', enrichedProperties);
    mixpanel.track(event, enrichedProperties);
    return NextResponse.json({ status: "Event tracked successfully" });
  } catch (error) {
    console.error("Error tracking event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
