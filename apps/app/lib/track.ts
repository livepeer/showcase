const track = async (
  eventName: string,
  eventProperties?: Record<string, any>
) => {
  function getUserId() {
    return "1231231231";
  }

  const userUUID = getUserId();

  const additionalProperties = {
    distinct_id: userUUID,
    $user_id: userUUID,
    $browser: navigator.userAgent,
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
        "Content-Type": "application/json",
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
