import pick from 'lodash/pick'
import { handleRequest } from '../handle'
import request from './request'
import { accesslistBaseURL } from '../config'
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
    return handleRequest<AccesslistInterface>(
        () => request.get(`${accesslistBaseURL}/${id}`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const showBlacklist = (id: string, pagination: PaginationState) => {
    const param = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize
    }
    return handleRequest<BlacklistInterface>(
        () => request.get(`${accesslistBaseURL}/${id}/blacklist?page=${param.page}&limit=${param.limit}`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const showProxies = (id: string, pagination: PaginationState) => {
    const param = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize
    }
    return handleRequest<any>(
        () => request.get(`${accesslistBaseURL}/${id}/proxies?page=${param.page}&limit=${param.limit}`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const view = () => {
    return handleRequest<any>(
        () => request.get(`${accesslistBaseURL}`, HeaderAuth),
        r => {
            return {
                data: r.data.data
            };
        }
    )
}

const list = (pagination: PaginationState) => {
    const param = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize
    }
    return handleRequest<any>(
        () => request.get(`${accesslistBaseURL}?page=${param.page}&limit=${param.limit}`, HeaderAuth),
        r => {
            return {
                data: r.data.data
            };
        }
    )
}

const newItem = (input: Partial<AccesslistInterface>) => {
    const { name } = pick(input, ['name'])
    return handleRequest<AccesslistInterface>(
        () => request.post(`${accesslistBaseURL}`, { name }, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}


const updateItem = () => {
    return
}

const AccesslistAPI = {
    detail,
    view,
    newItem,
    updateItem,
    showProxies,
    showBlacklist,
    list
}

export default AccesslistAPI