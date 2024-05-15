import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-6 items-center justify-center bg-gray-100">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-4xl font-bold">ClrDoc</h1>
        <p className="pb-8">A platform to find transparent healthcare pricing</p>
      </div>
      <h2 className="text-3xl font-bold">I Am A...</h2>
      <div className="flex flex-row gap-6">
        <Link href={'./patient'}>
          <button className="btn btn-primary btn-lg">Patient</button>
        </Link>
        <Link href={'./provider'}>
          <button className="btn btn-secondary btn-lg">Provider</button>
        </Link>
      </div>
    </main>
  )
}
