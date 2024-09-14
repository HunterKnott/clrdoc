import NavBar from '../NavBar';
import Footer from '../Footer';

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col items-center bg-gray-100">
            <NavBar options={["App", "Providers", "Contact"]} />
            <div className="max-w-[800px] my-[80px] md:mt-[40px] w-full min-h-screen mx-auto text-center flex flex-col justify-center items-center px-4 sm:px-8">
                <h1 className="font-bold text-5xl pb-12">About Us</h1>
                <div className='flex flex-col md:flex-row gap-10'>
                    <div className='flex flex-col gap-6'>
                        <h2 className="font-bold text-2xl sm:text-xl md:text-3xl">Jaron Anderson</h2>
                        <div className='container flex flex-col justify-center items-center'>
                            <img 
                                src="/Images/JaronPicture.png" 
                                alt="Jaron Anderson" 
                                className='mb-8 w-[300px] md:w-[400px]'
                            />
                            <p>I&#39;m Jaron. I&#39;ve worked in the software industry for a while, and now I&#39;m hyper focused on building ClrDoc - a patient portal providing optometrists the ability to increase sales, and for patients a place to buy from their trusted provider online.</p>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <h2 className="font-bold text-2xl sm:text-xl md:text-3xl">Hunter Knott</h2>
                        <div className='container pl-0 sm:pl-6 flex flex-col justify-center items-center'>
                            <img 
                                src="/Images/HunterPicture.png" 
                                alt="Hunter Knott" 
                                className='mb-8 w-[200px] sm:w-[300px]'
                            />
                            <p>Hi there, I&#39;m Hunter Knott, a Computer Science student at Utah Valley University. I have experience in software development, data analytics, and business web development. I believe that independent providers should have greater reach in the competitive online market. We&#39;re determined to help make that happen with ClrDoc.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
