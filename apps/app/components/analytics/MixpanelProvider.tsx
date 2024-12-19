'use client';

import { ReactNode, useEffect } from 'react';
import mixpanel from 'mixpanel-browser';
import { mixpanel as mixpanelConfig } from '@/lib/env';

export function MixpanelProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (mixpanelConfig.projectToken) {
      mixpanel.init(mixpanelConfig.projectToken, { debug: true });
      console.log('Mixpanel initialized');
    }
  }, []);

  return <>{children}</>;
}