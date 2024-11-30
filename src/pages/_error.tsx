
export function ErrorPage({ statusCode }: { statusCode: number }) {
  const title = 'Error'

  return (
    <>
      <div>
        <main>
          <h1>Error Loading Page</h1>
          {statusCode && <p>Error code: {statusCode}</p>}
        </main>
      </div>
    </>
  )
}
