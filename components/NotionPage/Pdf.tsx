export default function Pdf({ file }: { file: string }) {
  const src =
    'https://docs.google.com/viewer?embedded=true&url=' +
    encodeURIComponent(file);
  return (
    <embed src={src} type="application/pdf" width="100%" height="100%"></embed>
  );
}
