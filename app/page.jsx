import Link from 'next/link';
import NavBar from './NavBar';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col gap-6 items-center bg-gray-100">
            <NavBar />
            <div className="max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col gap-6 justify-center items-center">
                <img src="Images/ClrDocIcon.png" alt="Icon" className="w-[200px]" />
                <h1 className="font-bold md:text-5xl sm:text-3xl text-2xl">A platform to find transparent healthcare pricing</h1>
                <p className="font-bold">Patients have access to leading healthcare practitioners and their pricing. Providers have access to a wider group of patients.</p>
                <div className="flex flex-row gap-8 justify-center items-center">
                    <Link href={'./patient'}>
                        <button className="bg-blue-500 w-[200px] rounded-md font-medium text-gray-200 my-6 py-3 hover:bg-blue-600 transition duration-300">Search Providers</button>
                    </Link>
                    <Link href={"Home"}>
                        <button className="text-gray-800 font-bold transition-colors duration-150 hover:text-blue-500">Learn More &rarr;</button>
                    </Link>
                </div>
            </div>
        </main>
    )
}