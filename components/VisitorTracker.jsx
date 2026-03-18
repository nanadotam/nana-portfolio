'use client';

import { useVisitorTracking } from '@/hooks/useVisitorTracking';

export function VisitorTracker() {
  useVisitorTracking();
  return null; // No UI - just tracking
}
