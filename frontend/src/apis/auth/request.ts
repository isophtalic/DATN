import axios from 'axios'
import { authBaseURL } from '../config'
import { AUTHEN_TOKEN_KEY } from '../constants/const'
import Cookie from 'js-cookie'

const request = axios.create({
    timeout: 15000,
    baseURL: authBaseURL
})

export const config = (authBaseURL: string) => {
    request.defaults.baseURL = authBaseURL
}

request.interceptors.request.use((config: any) => {
    return {
        ...config,
        headers: {
            ...(config?.headers || {})
        },
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config?.headers?.Authorization ?? Cookie.get(AUTHEN_TOKEN_KEY) ?? ""}`,
    }
})


export default request

export type RequestType = typeof request