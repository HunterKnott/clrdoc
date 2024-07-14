export default function Page() {
    return (
        <main className="flex min-h-screen flex-col gap-6 items-center justify-center bg-gray-100 py-24">
            <div className="flex flex-row gap-20 max-w-[800px] mt-[-96px] w-full mx-auto px-8 text-center justify-center items-center">
                <h1 className="font-bold">
                    What is ClrDoc?
                </h1>
                <p>
                    ClrDoc is a platform for patients to be connected with healthcare providers and know their starting service prices upfront. It&#39;s a great resource for people and families to plan ahead and stay on top of all their healthcare needs.
                </p>
            </div>
            <div className="flex flex-row gap-20 max-w-[800px] mt-[-96px] w-full h-screen mx-auto px-8 text-center justify-center items-center">
                <p>
                    ClrDoc is transparent and easy to use. Patients can ease of access to local providers in areas like dental and vision care.
                </p>
                <h1 className="font-bold">
                    Why ClrDoc?
                </h1>
            </div>
        </main>
    )
}