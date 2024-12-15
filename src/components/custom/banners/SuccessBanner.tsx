
import { BannerProps } from "@/lib/types/BannerProps"

export default function SuccessBanner({ text, size }: BannerProps) {

    if (size === 'large') {
        return (
            <div className="relative flex p-3 rounded-md text-green-700 bg-green-50 dark:bg-green-100">
                <div className="icon-container icon-md text-2xl mr-3 mt-0.5 text-green-500" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <path d="M22 4 12 14.01l-3-3"></path>
                    </svg>
                    </div>
                {text}
            </div>
        )
    }

    if (size === 'medium') {
        return (
            <div className="relative flex p-3 rounded-md text-green-700 bg-green-50 dark:bg-green-100 text-sm">
                <div className="icon-container icon-md text-2xl mr-3 text-green-500" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <path d="M22 4 12 14.01l-3-3"></path>
                    </svg>
                    </div>
                {text}
            </div>
        )
    }

    if (size === 'small') {
        return (
            <div className="relative flex p-3 rounded-md text-green-700 bg-green-50 dark:bg-green-100 py-1 text-sm">
                <div className="icon-container icon-sm text-lg mr-3 mt-0.5 text-green-500" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <path d="M22 4 12 14.01l-3-3"></path>
                    </svg>
                    </div>
                {text}
            </div>
        )
    }
}