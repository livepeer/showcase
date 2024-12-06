import { usePrivy, User } from "@privy-io/react-auth";

function getAnonymousId() {
  // Try to get existing anonymous ID
  let anonymousId = localStorage.getItem('mixpanel_anonymous_id');
  
  if (!anonymousId) {
    // Generate new UUID if none exists
    anonymousId = crypto.randomUUID();
    localStorage.setItem('mixpanel_anonymous_id', anonymousId);
  }
  
  return anonymousId;
}

async function identifyUser(userId: string, anonymousId: string) {
  try {
    const response = await fetch(`/api/mixpanel/identify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        distinct_id: userId,
        anonymous_id: anonymousId
      }),
    });
  } catch (error) {
    console.error("Error identifying user:", error);
  }
}

const track = async (
  eventName: string,
  eventProperties?: Record<string, any>,
  user?: User
) => {
  console.log("privy user", user);
  
  const anonymousId = getAnonymousId();
  const distinctId = user?.id || anonymousId;
  
  // If user just logged in, identify them
  if (user?.id && distinctId !== anonymousId) {
    await identifyUser(user.id, anonymousId);
  }
  
  const additionalProperties = {
    distinct_id: distinctId,
    $user_id: user?.id,  // Only set when logged in
    user_agent: navigator.userAgent,
    $browser: navigator.userAgent.match(/(?:Chrome|Firefox|Safari|Opera|Edge|IE)/)?.[0] || 'Unknown Browser',
    $browser_version: navigator.userAgent.match(/(?:Version|Chrome|Firefox|Safari|Opera|Edge|IE)\/?\s*(\d+)/)?.[1] || '',
    $current_url: window.location.href,
    $device: navigator.userAgent.match(/\((.*?)\)/)?.[1] || 'Unknown Device',
    $device_id: navigator.userAgent,
    $initial_referrer: document.referrer ? document.referrer : undefined,
    $initial_referring_domain: document.referrer
      ? new URL(document.referrer).hostname
      : undefined,
    $os: navigator.userAgent.match(/\(([^)]+)\)/)?.[1]?.split(';')[0] || 'Unknown OS',
    $screen_height: window.screen.height,
    $screen_width: window.screen.width,
  };
  const properties = {
    ...eventProperties,
    ...additionalProperties,
  };
  console.log(
    "Sending to mixpanel:",
    JSON.stringify({
      event: eventName,
      event_properties: eventProperties,
      properties: properties,
    })
  );
  try {
    const response = await fetch(`/api/mixpanel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event: eventName,
        properties: properties,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Mixpanel error response:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error tracking event:", error);
  }
};

export default track;
