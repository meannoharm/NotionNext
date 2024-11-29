import BLOG from 'blog.config';
import dynamic from 'next/dynamic';

const GoogleAnalytics = dynamic(() =>
  import('@next/third-parties/google').then((res) => res.GoogleAnalytics),
);
const DebugPanel = dynamic(() => import('./components/DebugPanel'), {
  ssr: false,
});
const ThemeSwitch = dynamic(() => import('./components/ThemeSwitch'), {
  ssr: false,
});
const Analytics = dynamic(
  () =>
    import('@vercel/analytics/react').then(async (m) => {
      return m.Analytics;
    }),
  { ssr: false },
);
const SpeedInsights = dynamic(
  () =>
    import('@vercel/speed-insights/next').then(async (m) => {
      return m.SpeedInsights;
    }),
  {
    ssr: false,
  },
);
const Ackee = dynamic(() => import('./components/Ackee'), { ssr: false });
const GoogleAdsense = dynamic(() => import('./components/GoogleAdsense'), {
  ssr: false,
});
const Messenger = dynamic(() => import('./components/FacebookMessenger'), {
  ssr: false,
});
const VConsole = dynamic(() => import('./components/VConsole'), { ssr: false });
const CustomContextMenu = dynamic(
  () => import('./components/CustomContextMenu'),
  { ssr: false },
);
const DisableCopy = dynamic(() => import('./components/DisableCopy'), {
  ssr: false,
});
const AdBlockDetect = dynamic(() => import('./components/AdBlockDetect'), {
  ssr: false,
});

const ExternalPlugin = (props: any) => {
  return (
    <>
      {BLOG.THEME_SWITCH && <ThemeSwitch />}
      {BLOG.DEBUG && <DebugPanel />}
      {BLOG.ANALYTICS_ACKEE_TRACKER && <Ackee />}
      {BLOG.ANALYTICS_VERCEL && <Analytics />}
      {BLOG.VERCEL_SPEED_INSIGHTS && <SpeedInsights />}
      {BLOG.ADSENSE_GOOGLE_ID && <GoogleAdsense />}
      {BLOG.FACEBOOK_APP_ID && BLOG.FACEBOOK_PAGE_ID && <Messenger />}
      {BLOG.CUSTOM_RIGHT_CLICK_CONTEXT_MENU && <CustomContextMenu {...props} />}
      {!BLOG.CAN_COPY && <DisableCopy />}
      {BLOG.AD_WWADS_BLOCK_DETECT && <AdBlockDetect />}
      {BLOG.ANALYTICS_GOOGLE_ID && (
        <GoogleAnalytics gaId={BLOG.ANALYTICS_GOOGLE_ID} />
      )}
      <VConsole />
    </>
  );
};

export default ExternalPlugin;
