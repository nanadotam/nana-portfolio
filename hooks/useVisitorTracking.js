'use client';

import { useEffect, useRef, useState } from 'react';
import {
  getOrCreateVisitorId,
  getOrCreateSessionId,
  getVisitorMetadata
} from '@/lib/cookies';

export function useVisitorTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const scrollDepthRef = useRef(0);
  const interactionEventsRef = useRef([]);
  const pageStartTimeRef = useRef(Date.now());
  const trackingTimeoutRef = useRef(null);

  useEffect(() => {
    const recordVisit = async () => {
      try {
        const visitorId = getOrCreateVisitorId();
        const sessionId = getOrCreateSessionId();
        const metadata = getVisitorMetadata();

        if (!visitorId || !sessionId || !metadata) return;

        // Get client IP via API endpoint
        const ipResponse = await fetch('/api/visitor/ip');
        const { ip } = await ipResponse.json();

        const visitData = {
          visitor_id: visitorId,
          session_id: sessionId,
          ip_address: ip,
          page_url: metadata.page_url,
          page_title: metadata.page_title,
          referrer: metadata.referrer,
          user_agent: metadata.user_agent,
          browser: metadata.browser,
          operating_system: metadata.operating_system,
          device_type: metadata.device_type,
          json_data: metadata
        };

        // Send to tracking API
        await fetch('/api/visitor/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(visitData)
        });

        setIsTracking(true);
      } catch (error) {
        console.error('Visitor tracking error:', error);
      }
    };

    recordVisit();

    // Track scroll depth
    const handleScroll = () => {
      const scrollPercentage =
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100;
      scrollDepthRef.current = Math.max(scrollDepthRef.current, Math.round(scrollPercentage));
    };

    // Track interactions
    const handleInteraction = (event) => {
      const eventData = {
        type: event.type,
        target: event.target?.tagName || 'unknown',
        timestamp: new Date().toISOString()
      };
      interactionEventsRef.current.push(eventData);
    };

    // Track when user leaves or time passes
    const handleBeforeUnload = () => {
      sendSessionData();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Also record data periodically (every 5 minutes)
    trackingTimeoutRef.current = setInterval(sendSessionData, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (trackingTimeoutRef.current) {
        clearInterval(trackingTimeoutRef.current);
      }
      sendSessionData();
    };
  }, []);

  const sendSessionData = async () => {
    try {
      const visitorId = getOrCreateVisitorId();
      const sessionId = getOrCreateSessionId();
      const visitDuration = Math.round((Date.now() - pageStartTimeRef.current) / 1000);

      if (!visitorId || !sessionId) return;

      await fetch('/api/visitor/update-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id: visitorId,
          session_id: sessionId,
          scroll_depth: scrollDepthRef.current,
          visit_duration_seconds: visitDuration,
          interaction_events: interactionEventsRef.current
        })
      });
    } catch (error) {
      console.error('Error sending session data:', error);
    }
  };

  return { isTracking };
}
