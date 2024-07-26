'use client';

export default function LinkButton({ srcPath, altText, url, position }) {
    const openUrl = () => {
        const newTab = window.open(url, '_blank');
        if (newTab) {
            newTab.focus();
        }
    };

    return (
        <div className="hover:scale-105 transition-transform duration-300">
            <button
                className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center transform transition-transform hover:bg-gradient-to-r from-gray-200 to-gray-300 duration-1000"
                // onClick={openUrl}>
                >
                <img src={srcPath} alt={altText} className={position} />
            </button>
        </div>
    )
}