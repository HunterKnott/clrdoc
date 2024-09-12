import Link from 'next/link';
import NavBar from './NavBar';
import Footer from './Footer';
import { FaChartLine, FaGlasses, FaUserPlus, FaLaptopMedical } from "react-icons/fa";

const SolutionItem = ({ icon: Icon, text, subtext }) => (
  <div className='flex flex-col items-center max-w-xs'>
    <div className='w-40 h-40 bg-blue-200 rounded-full flex items-center justify-center mb-4'>
      <Icon className='text-6xl text-blue-600'/>
    </div>
    <h3 className='font-bold text-xl mb-2 text-center'>{text}</h3>
    <p className='text-center text-gray-600'>{subtext}</p>
  </div>
);

export default function Home() {
  const solutions = [
    { 
      icon: FaChartLine, 
      text: "Boost Your Revenue", 
      subtext: "Increase sales by offering your glasses online 24/7. Our platform enables you to reach customers beyond your physical store hours, significantly expanding your earning potential."
    },
    { 
      icon: FaLaptopMedical, 
      text: "Seamless Integration", 
      subtext: "Easily connects with your existing Practice Management System and inventory management."
    },
    { 
      icon: FaUserPlus, 
      text: "Reach More Customers", 
      subtext: "Attract new clients with the convenience of online shopping. Our platform makes it easy for customers to browse and purchase glasses from the comfort of their homes."
    },
    { 
      icon: FaGlasses, 
      text: "Expand Your Inventory", 
      subtext: "Sell your in-store stock or partner with distributors for a wider selection. Give more options to your customers and save inventory space."
    },
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
        <div className='flex flex-col md:flex-row justify-center gap-12 px-4 md:px-8'>
          {solutions.map((solution, index) => (
            <SolutionItem key={index} {...solution} />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}