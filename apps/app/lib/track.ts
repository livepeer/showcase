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
    $browser_version: navigator.appVersion,
    $current_url: window.location.href,
    $device: navigator.platform,
    $device_id: navigator.userAgent,
    $initial_referrer: document.referrer ? document.referrer : undefined,
    $initial_referring_domain: document.referrer
      ? new URL(document.referrer).hostname
      : undefined,
    $os: navigator.platform,
    $screen_height: window.screen.height,
    $screen_width: window.screen.width,
  };
  const properties = {
    ...eventProperties,
    ...additionalProperties,
  };

  fetch("/api/mixpanel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event: eventName,
      properties: properties,
    }),
  });
};

export default track;
