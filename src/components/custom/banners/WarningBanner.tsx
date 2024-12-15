
import { BannerProps } from "@/lib/types/BannerProps"

export default function WarningBanner({ text, size }: BannerProps) {

    if (size === 'large') {
        return (
            <div className="relative flex p-3 rounded-md text-yellow-700 bg-yellow-50 dark:bg-yellow-100">
                <div className="icon-container icon-md text-2xl mr-3 mt-0.5 text-yellow-500" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-triangle">
                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01"></path>
                    </svg>
                </div>
                {text}
            </div>
        )
    }

    if (size === 'medium') {
        return (
            <div className="relative flex p-3 rounded-md text-yellow-700 bg-yellow-50 dark:bg-yellow-100 text-sm">
                <div className="icon-container icon-md text-2xl mr-3 text-yellow-500" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-triangle">
                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01"></path>
                    </svg>
                </div>
                {text}
            </div>
        )
    }

    if (size === 'small') {
        return (
            <div className="relative flex p-3 rounded-md text-yellow-700 bg-yellow-50 dark:bg-yellow-100 py-1 text-sm">
                <div className="icon-container icon-sm text-lg mr-3 mt-0.5 text-yellow-500" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-triangle">
                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01"></path>
                    </svg>
                </div>
                {text}
            </div>
        )
    }
}