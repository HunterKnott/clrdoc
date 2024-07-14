import Link from 'next/link';

export default function PageLink({ path, text }) {
    return (
        <Link href={path}>
            <button className="text-gray-800 transition-colors duration-180 hover:text-pink-500">{text}</button>
        </Link>
    )
}