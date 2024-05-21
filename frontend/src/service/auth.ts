import jwt from 'jsonwebtoken'

function VerifyToken(token: string, SECRET_KEY: string) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
}

export default VerifyToken