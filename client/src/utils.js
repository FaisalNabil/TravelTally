export const isTokenExpired = (token) => {
    try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        
        if (!exp) {
            return false;
        }
        return Date.now() >= exp * 1000;
    } catch {
        return false;
    }
};