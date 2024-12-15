
import { BannerProps } from "@/lib/types/BannerProps"

export default function DangerBanner({ text, size }: BannerProps) {

    if (size === 'large') {
        return (
            <div className="relative flex p-3 rounded-md text-red-700 bg-red-50 dark:bg-red-100">
                <div className="icon-container icon-md text-2xl mr-3 mt-0.5 text-red-500" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-octagon">
                        <path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2zM15 9l-6 6m0-6 6 6"></path>
                    </svg>
                </div>
                {text}
            </div>
        )
    }

    if (size === 'medium') {
        return (
            <div className="relative flex p-3 rounded-md text-red-700 bg-red-50 dark:bg-red-100 text-sm">
                <div className="icon-container icon-md text-2xl mr-3 text-red-500" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-octagon">
                        <path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2zM15 9l-6 6m0-6 6 6"></path>
                    </svg>
                </div>
                {text}
            </div>
        )
    }

    if (size === 'small') {
        return (
            <div className="relative flex p-3 rounded-md text-red-700 bg-red-50 dark:bg-red-100 py-1 text-sm">
                <div className="icon-container icon-sm text-lg mr-3 mt-0.5 text-red-500" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-octagon">
                        <path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2zM15 9l-6 6m0-6 6 6"></path>
                    </svg>
                </div>
                {text}
            </div>
        )
    }
}