import axios from 'axios'
import { accesslistBaseURL } from '../config'
import { AUTHEN_TOKEN_KEY } from '../constants/const'
import Cookie from 'js-cookie'

const request = axios.create({
    timeout: 15000,
    baseURL: accesslistBaseURL
})

export const config = (accesslistBaseURL: string) => {
    request.defaults.baseURL = accesslistBaseURL
}

request.interceptors.request.use((config: any) => {
    console.log(`Bearer ${config?.headers?.Authorization ?? Cookie.get(AUTHEN_TOKEN_KEY) ?? ""}`);

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