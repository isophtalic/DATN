import { jwtVerify, SignJWT } from 'jose'

export const getSecret = () => {

    const secret = process.env.NEXT_PUBLIC_JWT_SECRET

    if (!secret || secret.length === 0) {
        throw new Error("The enviroment variable NEXT_PUBLIC_JWT_SECRET is not set.")
    }

    return secret
}

export const VerifyAuth = async (token: string) => {
    try {
        const verifed = await jwtVerify(token, new TextEncoder().encode(getSecret()))
        return verifed.payload as unknown as UserJwtPayload
    } catch (error) {
        throw new Error('Your token has expired.')
    }
}