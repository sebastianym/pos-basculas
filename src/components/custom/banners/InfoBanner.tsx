
import { BannerProps } from "@/lib/types/BannerProps"

export default function InfoBanner({ text, size }: BannerProps) {

    if (size === 'large') {
        return (
            <div className="relative flex p-3 rounded-md text-blue-700 bg-blue-50 dark:bg-blue-100">
                <div className="icon-container icon-md text-2xl mr-3 mt-0.5 text-blue-500" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-info">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4m0-4h.01"></path>
                    </svg>
                </div>
                {text}
            </div>
        )
    }

    if (size === 'medium') {
        return (
            <div className="relative flex p-3 rounded-md text-blue-700 bg-blue-50 dark:bg-blue-100 text-sm">
                <div className="icon-container icon-md text-2xl mr-3 text-blue-500" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-info">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4m0-4h.01"></path>
                    </svg>
                </div>
                {text}
            </div>
        )
    }

    if (size === 'small') {
        return (
            <div className="relative flex p-3 rounded-md text-blue-700 bg-blue-50 dark:bg-blue-100 py-1 text-sm">
                <div className="icon-container icon-sm text-lg mr-3 mt-0.5 text-blue-500" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-info">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4m0-4h.01"></path>
                    </svg>
                </div>
                {text}
            </div>
        )
    }
}