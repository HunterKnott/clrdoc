import Link from 'next/link';
import NavBar from './NavBar';
import Footer from './Footer';
import { FaMagnifyingGlass, FaRegEye, FaGlasses, FaRegThumbsUp, FaRegHeart } from "react-icons/fa6";

export default function Home() {
    return (
        <main style={{ background: '#EEF1F2' }} className="flex min-h-screen flex-col gap-6 items-center">
            <NavBar options={["App", "About", "Contact"]}/>
            <div style={{ background: '#EEF1F2' }} className="lg:px-96 mt-[24px] w-full h-screen mx-auto text-center flex flex-col gap-6 justify-center items-center">
                <h1 className="font-bold md:text-5xl sm:text-3xl text-2xl">Sell Your Glasses Online</h1>
                <p className="font-bold">ClrDoc.com lets you sell your glasses on your website.</p>
                <div className="flex flex-row gap-8 justify-center items-center">
                    <Link href={'./contact'}>
                        <button className="bg-blue-500 flex flex-row gap-4 justify-center w-[200px] rounded-md font-medium text-gray-200 my-6 py-3 hover:bg-blue-600 transition duration-300">
                            Join Waitlist
                            {/* <FaMagnifyingGlass className='mt-1' /> */}
                        </button>
                    </Link>
                </div>
            </div>
            <div className='text-center pb-8'>
                <h2 className='font-bold mb-8 mt-4 px-4 text-4xl md:text-5xl'>ClrDoc Solutions</h2>
                <div className='flex flex-col md:flex-row gap-20 px-4 md:px-0'>
                    {/* Item 1 */}
                    <div className='flex flex-row md:flex-col items-center'>
                    <div className='w-40 h-40 bg-blue-200 rounded-full flex items-center justify-center'>
                        <FaRegEye className='text-8xl'/>
                    </div>
                    <p className='font-bold ml-4 md:ml-0 md:mt-4 md:text-center md:max-w-[12rem]'>For all optometrists</p>
                    </div>
                    {/* Item 2 */}
                    <div className='flex flex-row md:flex-col items-center'>
                    <div className='w-40 h-40 bg-blue-200 rounded-full flex items-center justify-center'>
                        <FaGlasses className='text-8xl'/>
                    </div>
                    <p className='font-bold ml-4 md:ml-0 md:mt-4 md:text-center md:max-w-[12rem]'>An E-commerce platform for glasses</p>
                    </div>
                    {/* Item 3 */}
                    <div className='flex flex-row md:flex-col items-center'>
                    <div className='w-40 h-40 bg-blue-200 rounded-full flex items-center justify-center'>
                        <FaRegThumbsUp className='text-8xl'/>
                    </div>
                    <p className='font-bold ml-4 md:ml-0 md:mt-4 md:text-center md:max-w-[12rem]'>Reach more patients</p>
                    </div>
                    {/* Item 4 */}
                    <div className='flex flex-row md:flex-col items-center'>
                    <div className='w-40 h-40 bg-blue-200 rounded-full flex items-center justify-center'>
                        <FaRegHeart className='text-8xl'/>
                    </div>
                    <p className='font-bold ml-4 md:ml-0 md:mt-4 md:text-center md:max-w-[12rem]'>Help more people</p>
                    </div>
                </div>
            </div>
            {/* <div className="flex flex-row gap-12 p-8 md:w-[60%]">
                <h1 className="font-bold md:text-5xl sm:text-3xl text-2xl" style={{ color: '#424CBB' }}>
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
                <h1 className="font-bold md:text-5xl sm:text-3xl text-2xl" style={{ color: '#424CBB' }}>
                    Why ClrDoc?
                </h1>
            </div> */}
            {/* <div className='bg-gray-300 flex flex-col md:flex-row w-full px-8 py-20 gap-20'>
                <div>
                    <span className="text-4xl font-bold" style={{ color: '#424CBB' }}>26 Million people</span>
                    <p>in the United States were uninsured in 2022 according to a report by the Census Bureau.</p>
                </div>
                <div>
                    <span className="text-4xl font-bold" style={{ color: '#424CBB' }}>73% of adults</span>
                    <p>say they are worried about the cost of healthcare services.</p>
                </div>
                <div>
                    <span className="text-4xl font-bold" style={{ color: '#424CBB' }}>61% of U.S. adults</span>
                    <p>see reducing healthcare costs as a top priority as of 2022.</p>
                </div>
            </div> */}
            <Footer />
        </main>
    )
}