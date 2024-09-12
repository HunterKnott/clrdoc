import Link from 'next/link';
import NavBar from './NavBar';
import Footer from './Footer';
import { FaRegEye, FaGlasses, FaRegThumbsUp, FaRegHeart } from "react-icons/fa6";

const SolutionItem = ({ icon: Icon, text }) => (
  <div className='flex flex-row md:flex-col items-center'>
    <div className='w-40 h-40 bg-blue-200 rounded-full flex items-center justify-center'>
      <Icon className='text-8xl'/>
    </div>
    <p className='font-bold ml-4 md:ml-0 md:mt-4 md:text-center md:max-w-[12rem]'>{text}</p>
  </div>
);

export default function Home() {
  const solutions = [
    { icon: FaRegEye, text: "For all optometrists" },
    { icon: FaGlasses, text: "An E-commerce platform for glasses" },
    { icon: FaRegThumbsUp, text: "Reach more patients" },
    { icon: FaRegHeart, text: "Help more people" },
  ];

  return (
    <main className="bg-gray-200 flex min-h-screen flex-col items-center">
      <NavBar options={["App", "About", "Contact"]}/>
      <div className="w-full relative md:flex md:flex-row" style={{ background: '#EEF1F2' }}>
        {/* Image container - visible on small screens */}
        <div className='md:hidden w-full h-screen absolute inset-0'>
          <img src="Images/FrontImage.jpg" alt="ClrDoc Sample" className="w-full h-full object-cover" />
        </div>
        {/* Text content */}
        <div className='w-full md:w-1/2 min-h-screen flex flex-col justify-center items-center md:items-start px-8 md:px-16 text-center md:text-left relative z-10 bg-[#EEF1F2]/80 md:bg-transparent'>
          <h1 className="font-bold text-4xl sm:text-5xl md:text-5xl mb-4">Sell Your Glasses Online</h1>
          <p className="font-bold text-xl sm:text-2xl md:text-base mb-6">ClrDoc.com lets you sell <strong>your</strong> glasses on <strong>your</strong> website.</p>
          <Link href={'./contact'}>
            <button className="bg-blue-500 flex flex-row gap-4 justify-center w-[200px] rounded-md font-medium text-gray-200 py-3 hover:bg-blue-600 transition duration-300">
              Join Waitlist
            </button>
          </Link>
        </div>
        {/* Image container - visible on medium and larger screens */}
        <div className='hidden md:block md:w-1/2 h-screen'>
          <img src="Images/FrontImage.jpg" alt="ClrDoc Sample" className="w-full h-full object-cover" />
        </div>
      </div>
      <div id="clrdoc-solutions" className='w-full text-center py-16 bg-gray-200'>
        <h2 className='font-bold mb-12 px-4 text-4xl md:text-5xl'>ClrDoc Solutions</h2>
        <div className='flex flex-col md:flex-row justify-center gap-20 px-4 md:px-0'>
          {solutions.map((solution, index) => (
            <SolutionItem key={index} {...solution} />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}