import pick from 'lodash/pick'
import { handleRequest } from '../handle'
import request from './request'
import { seclogBaseURL } from '../config'
// import { ProxyViewerEndpoint } from './config'
import { AUTHEN_TOKEN_KEY } from '../constants/const'
import Cookie from 'js-cookie'
import { PaginationState } from '@tanstack/react-table'

const HeaderAuth = {
    headers: {
        Authorization: `Bearer ${Cookie.get(AUTHEN_TOKEN_KEY)}`
    }
}

const detail = (id: string) => {
    return handleRequest<ArraySecureLogs>(
        () => request.get(`${seclogBaseURL}/${id}`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}


const view = (pagination: PaginationState) => {
    const param = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize
    }
    return handleRequest<any>(
        () => request.get(`${seclogBaseURL}?page=${param.page}&limit=${param.limit}`, HeaderAuth),
        r => {
            return {
                data: r.data.data
            };
        }
    )
}


const SecureLogsAPI = {
    detail,
    view,
}

export default SecureLogsAPI