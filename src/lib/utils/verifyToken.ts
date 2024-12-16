import { logoutAction } from '@/data/actions/auth/logoutAction';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface DecodedToken {
    id: string;
    role?: string;
}

// Función para verificar y decodificar el token
export function verifyToken(authHeader?: string): DecodedToken | null {
    if (!JWT_SECRET) {
        throw new Error('Se requiere el JWT_SECRET para verificar el token');
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & DecodedToken;
        if (decoded && (decoded.role === 'ADMIN' || decoded.role === 'USER')) {
            return decoded;
        }
        return null;
    } catch (error) {
        logoutAction();
        return null;
    }
}