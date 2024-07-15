import NavBar from '../NavBar';

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col gap-6 items-center bg-gray-100">
            <div className="max-w-[800px] mt-[-196px] w-full h-screen px-8 mx-auto pb-0 text-center flex flex-col gap-24 justify-center items-center">
                <h1 className="font-bold md:text-5xl sm:text-3xl text-2xl">About Us</h1>
                <div className='flex flex-col md:flex-row gap-20'>
                    <div className='flex flex-col gap-6'>
                        <h2>Jaron Anderson</h2>
                        <div className='container'>
                            <img src="Images/JaronPicture.png" alt="Image" />
                        </div>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <h2>Hunter Knott</h2>
                        <div className='container'>
                            <img src="Images/HunterPicture.png" alt="Images" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}