import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { CDN_BASE } from '@/constants';

/**
 * 二维码生成
 */
export default function QrCode({ value }: { value: string }) {
  const qrcodeRef = useRef<any>(null);
  const domRef = useRef<HTMLDivElement>(null);

  const generateQrCode = () => {
    if (!value) return;

    const QRCode = (window as any).QRCode;
    if (QRCode) {
      qrcodeRef.current = new QRCode(domRef.current, {
        text: value,
        width: 256,
        height: 256,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H,
      });
    }
  };

  useEffect(() => {
    if (qrcodeRef.current) {
      qrcodeRef.current.clear();
      qrcodeRef.current.makeCode(value);
    } else {
      generateQrCode();
    }
  }, [value]);

  return (
    <>
      <div ref={domRef}></div>
      <Script
        src={`${CDN_BASE}/qrcodejs/1.0.0/qrcode.min.js`}
        onLoad={generateQrCode}
      />
    </>
  );
}
