import BLOG from 'blog.config';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Script from 'next/script';

/**
 * 初始化谷歌广告
 * @returns
 */
export default function GoogleAdsense() {
  const router = useRouter();

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
    if (!BLOG.ADSENSE_GOOGLE_ID) return;

    const timer = setTimeout(() => {
      initGoogleAdsense();
    }, 3000);

    return () => clearTimeout(timer); // 清除定时器
  }, [router]);

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${BLOG.ADSENSE_GOOGLE_ID}`}
    />
  );
}

interface AdSlotProps {
  type?: 'show' | 'in-article' | 'flow' | 'native';
}

const AdSlot: React.FC<AdSlotProps> = ({ type = 'show' }) => {
  if (!BLOG.ADSENSE_GOOGLE_ID) {
    return null;
  }

  const commonProps = {
    className: 'adsbygoogle',
    'data-ad-client': BLOG.ADSENSE_GOOGLE_ID,
    'data-adtest': BLOG.ADSENSE_GOOGLE_TEST ? 'on' : 'off',
  };

  const getAdAttributes = () => {
    switch (type) {
      case 'in-article':
        return {
          ...commonProps,
          style: { display: 'block', textAlign: 'center' as const },
          'data-ad-layout': 'in-article',
          'data-ad-format': 'fluid',
          'data-ad-slot': BLOG.ADSENSE_GOOGLE_SLOT_IN_ARTICLE,
        };
      case 'flow':
        return {
          ...commonProps,
          style: { display: 'block' },
          'data-ad-format': 'fluid',
          'data-ad-layout-key': '-5j+cz+30-f7+bf',
          'data-ad-slot': BLOG.ADSENSE_GOOGLE_SLOT_FLOW,
        };
      case 'native':
        return {
          ...commonProps,
          style: { display: 'block', textAlign: 'center' as const },
          'data-ad-format': 'autorelaxed',
          'data-ad-slot': BLOG.ADSENSE_GOOGLE_SLOT_NATIVE,
        };
      default:
        return {
          ...commonProps,
          style: { display: 'block' },
          'data-ad-slot': BLOG.ADSENSE_GOOGLE_SLOT_AUTO,
          'data-ad-format': 'auto',
          'data-full-width-responsive': 'true',
        };
    }
  };

  return <ins {...getAdAttributes()} />;
};

export { AdSlot };
