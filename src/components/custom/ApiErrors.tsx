import DangerBanner from "./banners/DangerBanner";

interface ApiErrorsProps {
    error: string;
}

export function ApiErrors({ error }: ApiErrorsProps) {
    if (!error) {
        return null
    };

    if (error == 'Credenciales inválidas') {
        return (
            <div className="mt-5">
                <DangerBanner text="Credenciales inválidas, por favor, intenta de nuevo." size="medium" />
            </div>

        )
    }

    return (
        <div className="mt-5">
            <DangerBanner text={error} size="medium" />
        </div>
    );
}