import NavBar from '../NavBar';

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col gap-6 items-center bg-gray-100">
            <NavBar options={["App", "Providers", "Contact"]}/>
            <div className="max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col gap-6 justify-center items-center">
                <h1 className="font-bold md:text-5xl sm:text-3xl text-2xl pb-12">About Us</h1>
                <div className='flex flex-col md:flex-row gap-20'>
                    <div className='flex flex-col gap-6'>
                        <h2 className="font-bold md:text-3xl sm:text-xl text-2xl">Jaron Anderson</h2>
                        <div className='container'>
                            <img src="Images/JaronPicture.png" alt="Image" className='mb-8 w-[400px]' />
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <h2 className="font-bold md:text-3xl sm:text-xl text-2xl">Hunter Knott</h2>
                        <div className='container pl-6'>
                            <img src="Images/HunterPicture.png" alt="Images" className='mb-8 w-[300px]' />
                            <p>Hi there, I&#39;m Hunter Knott. I&#39;m currently studying Computer Science at Utah Valley University. I have experience in software development and data analytics in a manufacturing environment, along with business web development. I love what I do!</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

// 