// Cookie utilities for visitor tracking
const VISITOR_ID_KEY = 'nana_portfolio_visitor_id';
const SESSION_ID_KEY = 'nana_portfolio_session_id';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * Get or create a visitor ID (persists across sessions)
 */
export function getOrCreateVisitorId() {
  if (typeof window === 'undefined') return null;

  let visitorId = getCookie(VISITOR_ID_KEY);

  if (!visitorId) {
    visitorId = generateUUID();
    setCookie(VISITOR_ID_KEY, visitorId, 365 * 24 * 60); // 1 year
  }

  return visitorId;
}

/**
 * Get or create a session ID (expires after inactivity)
 */
export function getOrCreateSessionId() {
  if (typeof window === 'undefined') return null;

  let sessionId = getCookie(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = generateUUID();
    setCookie(SESSION_ID_KEY, sessionId, SESSION_TIMEOUT / 60 / 1000); // in minutes
  } else {
    // Reset expiry on each access
    setCookie(SESSION_ID_KEY, sessionId, SESSION_TIMEOUT / 60 / 1000);
  }

  return sessionId;
}

/**
 * Set a cookie with name, value, and max age
 */
export function setCookie(name, value, maxAgeMinutes = 525600) {
  if (typeof document === 'undefined') return;

  const maxAgeSeconds = maxAgeMinutes * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

/**
 * Get a cookie value
 */
export function getCookie(name) {
  if (typeof document === 'undefined') return null;

  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name) {
  setCookie(name, '', -1);
}

/**
 * Generate a UUID v4
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get visitor metadata
 */
export function getVisitorMetadata() {
  if (typeof window === 'undefined') return null;

  const ua = window.navigator.userAgent;

  return {
    user_agent: ua,
    browser: detectBrowser(ua),
    operating_system: detectOS(ua),
    device_type: detectDeviceType(ua),
    page_title: document.title,
    page_url: window.location.href,
    referrer: document.referrer || null,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}

/**
 * Detect browser from user agent
 */
function detectBrowser(ua) {
  if (ua.indexOf('Firefox') > -1) return 'Firefox';
  if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) return 'Safari';
  if (ua.indexOf('Chrome') > -1) return 'Chrome';
  if (ua.indexOf('Edge') > -1 || ua.indexOf('Edg') > -1) return 'Edge';
  if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
  return 'Unknown';
}

/**
 * Detect operating system from user agent
 */
function detectOS(ua) {
  if (ua.indexOf('Windows') > -1) return 'Windows';
  if (ua.indexOf('Mac') > -1) return 'macOS';
  if (ua.indexOf('X11') > -1 && ua.indexOf('Linux') > -1) return 'Linux';
  if (ua.indexOf('Android') > -1) return 'Android';
  if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) return 'iOS';
  return 'Unknown';
}

/**
 * Detect device type from user agent
 */
function detectDeviceType(ua) {
  if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
    return /ipad/i.test(ua) ? 'tablet' : 'mobile';
  }
  return 'desktop';
}
