import { jwtDecode } from 'jwt-decode';

export function decodeToken(token) {
    try {
        return jwtDecode(token)
    } catch (error) {
        console.error('Failed to decode token', error);
        return null;
    }
}

export function hasRole(token, requiredRole) {
    const decodedToken = decodeToken(token);
    if (!decodedToken || !decodedToken.scope) return false;

    const scopes = decodedToken.scope.split(' ');
    return scopes.includes(requiredRole);
}
