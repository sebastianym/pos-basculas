export function ZodErrors({ error }: { error: string[] }) {
    if (!error) return null;
    return error.map((err: string, index: number) => (
        <span key={index} className="flex items-center text-red-600 leading-[18px] font-normal text-xs mt-2">
            <div className="text-current icon-container icon-sm text-lg mr-1.5" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-circle">
                    <circle cx="12" cy="12" r="10">
                    </circle>
                    <path d="M12 8v4m0 4h.01">
                    </path>
                </svg>
            </div> {err}
        </span>
    ));
}