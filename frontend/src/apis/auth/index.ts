import pick from 'lodash/pick'
import { handleRequest } from '../handle'
import request from './request'
import { apiAuthLogin } from './config'
import { BASE_URL } from '../config'

const authLogin = (p: Partial<UserAccountInterface>) => {
    console.log("🚀 ~ authLogin ~ BASE_URL:", BASE_URL)
    const { username, password } = pick(p, ['username', 'password'])
    return handleRequest<{ token: string }>(
        () => request.post(apiAuthLogin, { username, password }),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const AuthAPI = {
    authLogin
}

export default AuthAPI