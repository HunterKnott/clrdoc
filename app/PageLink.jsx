import Link from 'next/link';

export default function PageLink({ path, text, onClick }) {
    if (onClick) {
        return (
            <button
                onClick={onClick}
                className="text-gray-800 font-bold text-lg transition-colors duration-180 hover:text-indigo-700"
            >
                {text}
            </button>
        );
    }

    return (
        <Link href={path}>
            <button className="text-gray-800 font-bold text-lg transition-colors duration-180 hover:text-indigo-700">{text}</button>
        </Link>
    )
}