import pick from 'lodash/pick'
import { handleRequest } from '../handle'
import request from './request'
import { accesslistBaseURL } from '../config'
// import { ProxyViewerEndpoint } from './config'
import { AUTHEN_TOKEN_KEY } from '../constants/const'
import Cookie from 'js-cookie'
import { PaginationState } from '@tanstack/react-table'
import { String, values } from 'lodash'

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

const showBlacklist = (id: string, pagination: PaginationState, _valueSearch: string = "") => {
    const param = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize
    }
    return handleRequest<BlacklistInterface>(
        () => request.get(`${accesslistBaseURL}/${id}/blacklist?page=${param.page}&limit=${param.limit}&search=${_valueSearch}`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const showProxies = (id: string, pagination: PaginationState, _valueSearch: string = "") => {
    const param = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize
    }
    return handleRequest<any>(
        () => request.get(`${accesslistBaseURL}/${id}/proxies?page=${param.page}&limit=${param.limit}&search=${_valueSearch}`, HeaderAuth),
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

const list = (pagination: PaginationState, _valueSearch: string = "") => {
    const param = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize
    }
    return handleRequest<any>(
        () => request.get(`${accesslistBaseURL}?page=${param.page}&limit=${param.limit}&search=${_valueSearch}`, HeaderAuth),
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

const deleteByID = (id: string) => {
    return handleRequest<AccesslistInterface>(
        () => request.delete(`${accesslistBaseURL}/${id}`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}


const updateItem = (id: string, input: AccesslistInterface) => {
    return handleRequest(
        () => request.patch(`${accesslistBaseURL}/${id}`, input, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const AccesslistAPI = {
    detail,
    view,
    newItem,
    updateItem,
    showProxies,
    showBlacklist,
    deleteByID,
    list
}

export default AccesslistAPI