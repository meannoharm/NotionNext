import useProgress from '@/utils/hooks/useProgress';
import useDarkMode from '@/utils/hooks/useDarkMode';
import { useConfigStore } from '@/providers/configProvider';
import { useShallow } from 'zustand/react/shallow';
import dynamic from 'next/dynamic';

const GoogleAnalytics = dynamic(() =>
  import('@next/third-parties/google').then((res) => res.GoogleAnalytics),
);
const DebugPanel = dynamic(() => import('@/components/Addon/DebugPanel'), {
  ssr: false,
});
const ThemeSwitch = dynamic(() => import('@/components/Addon/ThemeSwitch'), {
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
const Ackee = dynamic(() => import('@/components/Addon/Ackee'), { ssr: false });
const GoogleAdsense = dynamic(
  () => import('@/components/Addon/GoogleAdsense'),
  {
    ssr: false,
  },
);
const Messenger = dynamic(
  () => import('@/components/Addon/FacebookMessenger'),
  {
    ssr: false,
  },
);
const VConsole = dynamic(() => import('@/components/Addon/VConsole'), {
  ssr: false,
});
const CustomContextMenu = dynamic(
  () => import('@/components/Addon/CustomContextMenu'),
  { ssr: false },
);
const DisableCopy = dynamic(() => import('@/components/Addon/DisableCopy'), {
  ssr: false,
});

export default function Addon() {
  const {
    THEME_SWITCH,
    DEBUG,
    ACKEE_ENABLE,
    VERCEL_SPEED_INSIGHTS_ENABLE,
    VERCEL_ANALYTICS_ENABLE,
    GOOGLE_ADSENSE_ENABLE,
    FACEBOOK_APP_ID,
    FACEBOOK_PAGE,
    CUSTOM_RIGHT_CLICK_CONTEXT_MENU,
    CAN_COPY,
    GOOGLE_ANALYTICS_ENABLE,
    GOOGLE_ANALYTICS_ID,
  } = useConfigStore(
    useShallow((state) => ({
      THEME_SWITCH: state.THEME_SWITCH,
      DEBUG: state.DEBUG,
      ACKEE_ENABLE: state.ACKEE_ENABLE,
      VERCEL_SPEED_INSIGHTS_ENABLE: state.VERCEL_SPEED_INSIGHTS_ENABLE,
      VERCEL_ANALYTICS_ENABLE: state.VERCEL_ANALYTICS_ENABLE,
      GOOGLE_ADSENSE_ENABLE: state.GOOGLE_ADSENSE_ENABLE,
      FACEBOOK_APP_ID: state.FACEBOOK_APP_ID,
      FACEBOOK_PAGE: state.FACEBOOK_PAGE,
      CUSTOM_RIGHT_CLICK_CONTEXT_MENU: state.CUSTOM_RIGHT_CLICK_CONTEXT_MENU,
      CAN_COPY: state.CAN_COPY,
      GOOGLE_ANALYTICS_ENABLE: state.GOOGLE_ANALYTICS_ENABLE,
      GOOGLE_ANALYTICS_ID: state.GOOGLE_ANALYTICS_ID,
    })),
  );

  useProgress();
  useDarkMode();

  return (
    <>
      {THEME_SWITCH && <ThemeSwitch />}
      {DEBUG && <DebugPanel />}
      {ACKEE_ENABLE && <Ackee />}
      {VERCEL_SPEED_INSIGHTS_ENABLE && <SpeedInsights />}
      {VERCEL_ANALYTICS_ENABLE && <Analytics />}
      {GOOGLE_ADSENSE_ENABLE && <GoogleAdsense />}
      {FACEBOOK_APP_ID && FACEBOOK_PAGE && <Messenger />}
      {CUSTOM_RIGHT_CLICK_CONTEXT_MENU && <CustomContextMenu />}
      {!CAN_COPY && <DisableCopy />}
      {GOOGLE_ANALYTICS_ENABLE && GOOGLE_ANALYTICS_ID && (
        <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
      )}
      <VConsole />
    </>
  );
}
