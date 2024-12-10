import { User } from "@privy-io/react-auth";

// Add session end tracking when the page is unloaded
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const sessionId = sessionStorage.getItem('mixpanel_session_id');
    if (sessionId) {
      // Get the distinct ID and user info first
      const distinctId = localStorage.getItem('mixpanel_distinct_id');
      const userId = localStorage.getItem('mixpanel_user_id'); // This might be undefined if user isn't logged in

      const data = {
        event: "$session_end",
        properties: {
          $session_id: sessionId,
          distinct_id: distinctId,
          $user_id: userId,
          $current_url: window.location.href
        }
      };
      
      navigator.sendBeacon('/api/mixpanel', JSON.stringify(data));
      sessionStorage.removeItem('mixpanel_session_id');
    }
  });
}

async function getDistinctId(user: User | undefined) {
  // Try to get existing distinct ID
  let distinctId = localStorage.getItem('mixpanel_distinct_id');
  
  // If user just logged in, identify them
  if (user?.id && distinctId && user.id !== distinctId) {
    console.log("Identifying user", user.id, distinctId);
    await identifyUser(user.id, distinctId);
  }

  if (user) {
    console.log("Setting distinct id as user id", user.id);
    localStorage.setItem('mixpanel_user_id', user.id);
    localStorage.setItem('mixpanel_distinct_id', user.id);
    return user.id;
  }
  
  if (!distinctId) {
    console.log("Generating new distinct id");
    // Generate new UUID if none exists
    distinctId = crypto.randomUUID();
    localStorage.setItem('mixpanel_distinct_id', distinctId);
  }
  
  return distinctId;
}

function getSessionId(user: User | undefined) {
  let sessionId = sessionStorage.getItem('mixpanel_session_id');
  
  if (!sessionId) {
    // Generate new session ID if none exists
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('mixpanel_session_id', sessionId);
    
    // Track session start
    track("$session_start", undefined, user);
  }
  
  return sessionId;
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
  
  const distinctId = await getDistinctId(user);
  const sessionId = getSessionId(user);
  console.log("distinctId", distinctId);
  console.log("sessionId", sessionId);
  const additionalProperties = {
    distinct_id: distinctId,
    $user_id: user?.id,  // Only set when logged in
    $session_id: sessionId,  // Add session ID to all events
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
