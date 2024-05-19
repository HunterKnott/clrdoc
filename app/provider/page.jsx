import ProviderAuth from './ProviderAuth';

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col gap-6 items-center justify-center bg-gray-100 pt-24">
            <div className="flex flex-col gap-2 items-center">
                <h1 className="text-4xl font-bold">ClrDoc</h1>
                <p>Opening opportunities for healthcare providers to do a world of good</p>
                <ProviderAuth />
            </div>
        </main>
    )
}