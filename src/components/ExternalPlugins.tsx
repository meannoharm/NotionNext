import BLOG from 'blog.config';
import dynamic from 'next/dynamic';
import WebWhiz from './Webwhiz';

const TwikooCommentCounter = dynamic(
  () => import('@/components/TwikooCommentCounter'),
  { ssr: false },
);
const DebugPanel = dynamic(() => import('@/components/DebugPanel'), {
  ssr: false,
});
const ThemeSwitch = dynamic(() => import('@/components/ThemeSwitch'), {
  ssr: false,
});
const Fireworks = dynamic(() => import('@/components/Fireworks'), {
  ssr: false,
});
const Nest = dynamic(() => import('@/components/Nest'), { ssr: false });
const FlutteringRibbon = dynamic(
  () => import('@/components/FlutteringRibbon'),
  { ssr: false },
);
const Ribbon = dynamic(() => import('@/components/Ribbon'), { ssr: false });
const Sakura = dynamic(() => import('@/components/Sakura'), { ssr: false });
const StarrySky = dynamic(() => import('@/components/StarrySky'), {
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
const MusicPlayer = dynamic(() => import('@/components/Player'), {
  ssr: false,
});
const Ackee = dynamic(() => import('@/components/Ackee'), { ssr: false });
const Gtag = dynamic(() => import('@/components/Gtag'), { ssr: false });
const Busuanzi = dynamic(() => import('@/components/Busuanzi'), { ssr: false });
const GoogleAdsense = dynamic(() => import('@/components/GoogleAdsense'), {
  ssr: false,
});
const Messenger = dynamic(() => import('@/components/FacebookMessenger'), {
  ssr: false,
});
const VConsole = dynamic(() => import('@/components/VConsole'), { ssr: false });
const CustomContextMenu = dynamic(
  () => import('@/components/CustomContextMenu'),
  { ssr: false },
);
const DisableCopy = dynamic(() => import('@/components/DisableCopy'), {
  ssr: false,
});
const AdBlockDetect = dynamic(() => import('@/components/AdBlockDetect'), {
  ssr: false,
});
/**
 * 各种第三方组件
 * @param {*} props
 * @returns
 */
const ExternalPlugin = (props: any) => {
  return (
    <>
      {BLOG.THEME_SWITCH && <ThemeSwitch />}
      {BLOG.DEBUG && <DebugPanel />}
      {BLOG.ANALYTICS_ACKEE_TRACKER && <Ackee />}
      {BLOG.ANALYTICS_GOOGLE_ID && <Gtag />}
      {BLOG.ANALYTICS_VERCEL && <Analytics />}
      {BLOG.VERCEL_SPEED_INSIGHTS && <SpeedInsights />}
      {BLOG.ANALYTICS_BUSUANZI_ENABLE && <Busuanzi />}
      {BLOG.ADSENSE_GOOGLE_ID && <GoogleAdsense />}
      {BLOG.FACEBOOK_APP_ID && BLOG.FACEBOOK_PAGE_ID && <Messenger />}
      {BLOG.FIREWORKS && <Fireworks />}
      {BLOG.SAKURA && <Sakura />}
      {BLOG.STARRY_SKY && <StarrySky />}
      {BLOG.MUSIC_PLAYER && <MusicPlayer />}
      {BLOG.NEST && <Nest />}
      {BLOG.FLUTTERINGRIBBON && <FlutteringRibbon />}
      {BLOG.RIBBON && <Ribbon />}
      {BLOG.CUSTOM_RIGHT_CLICK_CONTEXT_MENU && <CustomContextMenu {...props} />}
      {!BLOG.CAN_COPY && <DisableCopy />}
      {BLOG.WEB_WHIZ_ENABLED && <WebWhiz />}
      {BLOG.AD_WWADS_BLOCK_DETECT && <AdBlockDetect />}
      <VConsole />
    </>
  );
};

export default ExternalPlugin;
