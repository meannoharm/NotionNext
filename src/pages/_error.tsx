export function ErrorPage({ statusCode }: { statusCode: number }) {
  return (
    <>
      <div>
        <main>
          <h1>Error Loading Page</h1>
          {statusCode && <p>Error code: {statusCode}</p>}
        </main>
      </div>
    </>
  );
}
