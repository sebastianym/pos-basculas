import { BannerProps } from "@/lib/types/BannerProps"

export default function PrimaryBanner({ text, size }: BannerProps) {

    if (size === 'large') {
        return (
            <div className="relative flex p-3 rounded-md text-pink-700 bg-pink-50 dark:bg-pink-100">
                <div className="icon-container icon-md text-2xl mr-3 mt-0.5 text-pink-500" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-gift">
                        <path d="M20 12v10H4V12M2 7h20v5H2zm10 15V7m0 0H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                    </svg>
                </div>
                {text}
            </div>
        )
    }

    if (size === 'medium') {
        return (
            <div className="relative flex p-3 rounded-md text-pink-700 bg-pink-50 dark:bg-pink-100 text-sm">
                <div className="icon-container icon-md text-2xl mr-3 text-pink-500" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-gift">
                        <path d="M20 12v10H4V12M2 7h20v5H2zm10 15V7m0 0H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                    </svg>
                </div>
                {text}
            </div>
        )
    }

    if (size === 'small') {
        return (
            <div className="relative flex p-3 rounded-md text-pink-700 bg-pink-50 dark:bg-pink-100 py-1 text-sm">
                <div className="icon-container icon-sm text-lg mr-3 mt-0.5 text-pink-500" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-gift">
                        <path d="M20 12v10H4V12M2 7h20v5H2zm10 15V7m0 0H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                    </svg>
                </div>
                {text}
            </div>
        )
    }
}