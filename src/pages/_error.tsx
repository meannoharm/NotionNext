import Error from 'next/error';

export default function ErrorPage({ statusCode }: { statusCode: number }) {
  return (
    <>
      <div>
        <main>
          <h1>Error Loading Page</h1>
          {statusCode && <Error statusCode={statusCode} />}
        </main>
      </div>
    </>
  );
}
