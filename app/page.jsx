import Link from 'next/link';
import NavBar from './NavBar';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col gap-6 items-center bg-gray-100">
            <NavBar options={["About", "Features", "Contact"]}/>
            <div className="max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col gap-6 justify-center items-center">
                <img src="Images/ClrDocIcon.png" alt="Icon" className="w-[200px]" />
                <h1 className="font-bold md:text-5xl sm:text-3xl text-2xl">A platform to find transparent healthcare pricing</h1>
                <p className="font-bold">Patients have access to leading healthcare practitioners and their pricing. Providers have access to a wider group of patients.</p>
                <div className="flex flex-row gap-8 justify-center items-center">
                    <Link href={'./patient'}>
                        <button className="bg-blue-500 w-[200px] rounded-md font-medium text-gray-200 my-6 py-3 hover:bg-blue-600 transition duration-300">Search Providers</button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-row gap-12 p-8 md:w-[60%]">
                <h1 className="font-bold md:text-5xl sm:text-3xl text-2xl">
                        What is ClrDoc?
                </h1>
                <p>
                    We connect with providers so you don&#39;t have to. ClrDoc offers clear, reliable information to eliminate the hassle of contacting multiple providers and comparing costs. With us, you can access transparent pricing, find local providers, and receive quality care easily.
                </p>
            </div>
            <div className="flex flex-row gap-12 p-8 md:w-[60%]">
                <p>
                    ClrDoc simplifies your search for local doctors and provides clarity on pricing, especially for self-pay patients. We facilitate direct connections with providers, ensuring transparency for informed healthcare decisions. Our platform prioritizes access to quality care, offering a straightforward solution to find the right healthcare provider without financial uncertainties.
                </p>
                <h1 className="font-bold md:text-5xl sm:text-3xl text-2xl">
                    Why ClrDoc?
                </h1>
            </div>
            <div className='bg-gray-300 flex flex-col md:flex-row w-full px-8 py-20 mb-20 gap-20'>
                <div>
                    <span className="text-4xl font-bold">26 Million people</span>
                    <p>in the United States were uninsured in 2022 according to a report by the Census Bureau.</p>
                </div>
                <div>
                    <span className="text-4xl font-bold">73% of adults</span>
                    <p>say they are worried about the cost of healthcare services.</p>
                </div>
                <div>
                    <span className="text-4xl font-bold">61% of U.S. adults</span>
                    <p>see reducing healthcare costs as a top priority as of 2022.</p>
                </div>
            </div>
        </main>
    )
}