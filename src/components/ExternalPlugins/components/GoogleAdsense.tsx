import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import Script from 'next/script';
import { useConfigStore } from '@/providers/configProvider';
import { useShallow } from 'zustand/react/shallow';

/**
 * 初始化谷歌广告
 * @returns
 */
export default function GoogleAdsense() {
  const { GOOGLE_ADSENSE_ENABLE, GOOGLE_ADSENSE_ID } = useConfigStore(
    useShallow((state) => ({
      GOOGLE_ADSENSE_ENABLE: state.GOOGLE_ADSENSE_ENABLE,
      GOOGLE_ADSENSE_ID: state.GOOGLE_ADSENSE_ID,
    })),
  );
  const router = useRouter();
  if (!GOOGLE_ADSENSE_ENABLE || !GOOGLE_ADSENSE_ID) return null;

  const initGoogleAdsense = () => {
    const ads = document.getElementsByClassName(
      'adsbygoogle',
    ) as HTMLCollectionOf<HTMLElement>;
    if (!window.adsbygoogle) return;

    Array.from(ads).forEach((ad) => {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error('Adsense Error:', e);
      }
    });
  };

  useEffect(() => {
    if (!GOOGLE_ADSENSE_ID) return;

    const timer = setTimeout(() => {
      initGoogleAdsense();
    }, 3000);

    return () => clearTimeout(timer); // 清除定时器
  }, [router]);

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_ID}`}
    />
  );
}

interface AdSlotProps {
  type?: 'show' | 'in-article' | 'flow' | 'native';
}

const AdSlot: React.FC<AdSlotProps> = ({ type = 'show' }) => {
  const {
    GOOGLE_ADSENSE_ENABLE,
    GOOGLE_ADSENSE_ID,
    GOOGLE_ADSENSE_TEST,
    GOOGLE_ADSENSE_SLOT_IN_ARTICLE,
    GOOGLE_ADSENSE_SLOT_FLOW,
    GOOGLE_ADSENSE_SLOT_NATIVE,
    GOOGLE_ADSENSE_SLOT_AUTO,
  } = useConfigStore(
    useShallow((state) => ({
      GOOGLE_ADSENSE_ENABLE: state.GOOGLE_ADSENSE_ENABLE,
      GOOGLE_ADSENSE_ID: state.GOOGLE_ADSENSE_ID,
      GOOGLE_ADSENSE_TEST: state.GOOGLE_ADSENSE_TEST,
      GOOGLE_ADSENSE_SLOT_IN_ARTICLE: state.GOOGLE_ADSENSE_SLOT_IN_ARTICLE,
      GOOGLE_ADSENSE_SLOT_FLOW: state.GOOGLE_ADSENSE_SLOT_FLOW,
      GOOGLE_ADSENSE_SLOT_NATIVE: state.GOOGLE_ADSENSE_SLOT_NATIVE,
      GOOGLE_ADSENSE_SLOT_AUTO: state.GOOGLE_ADSENSE_SLOT_AUTO,
    })),
  );
  if (!GOOGLE_ADSENSE_ENABLE || !GOOGLE_ADSENSE_ID) {
    return null;
  }

  const commonProps = {
    className: 'adsbygoogle',
    'data-ad-client': GOOGLE_ADSENSE_ID,
    'data-adtest': GOOGLE_ADSENSE_TEST ? 'on' : 'off',
  };

  const adAttributes = useMemo(() => {
    switch (type) {
      case 'in-article':
        return {
          ...commonProps,
          style: { display: 'block', textAlign: 'center' as const },
          'data-ad-layout': 'in-article',
          'data-ad-format': 'fluid',
          'data-ad-slot': GOOGLE_ADSENSE_SLOT_IN_ARTICLE,
        };
      case 'flow':
        return {
          ...commonProps,
          style: { display: 'block' },
          'data-ad-format': 'fluid',
          'data-ad-layout-key': '-5j+cz+30-f7+bf',
          'data-ad-slot': GOOGLE_ADSENSE_SLOT_FLOW,
        };
      case 'native':
        return {
          ...commonProps,
          style: { display: 'block', textAlign: 'center' as const },
          'data-ad-format': 'autorelaxed',
          'data-ad-slot': GOOGLE_ADSENSE_SLOT_NATIVE,
        };
      default:
        return {
          ...commonProps,
          style: { display: 'block' },
          'data-ad-slot': GOOGLE_ADSENSE_SLOT_AUTO,
          'data-ad-format': 'auto',
          'data-full-width-responsive': 'true',
        };
    }
  }, [type]);

  return <ins {...adAttributes} />;
};

export { AdSlot };
