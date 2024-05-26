import pick from 'lodash/pick'
import { handleRequest } from '../handle'
import request from './request'
import { proxyBaseURL } from '../config'
import { ProxyViewerEndpoint } from './config'
import { AUTHEN_TOKEN_KEY } from '../constants/const'
import Cookie from 'js-cookie'
import { PaginationState } from '@tanstack/react-table'

const HeaderAuth = {
    headers: {
        Authorization: `${Cookie.get(AUTHEN_TOKEN_KEY)}`
    }
}

const detail = (id: string) => {
    return handleRequest<ProxyViewerDetail>(
        () => request.get(`${ProxyViewerEndpoint}/${id}`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const view = (pagination: PaginationState, _valueSearch: string = "") => {
    const param = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize
    }
    return handleRequest<any>(
        () => request.get(`${ProxyViewerEndpoint}?page=${param.page}&limit=${param.limit}&search=${_valueSearch}&sort=${"created_at desc"}`, HeaderAuth),
        r => {
            return {
                data: r.data.data
            };
        }
    )
}

const newItem = (input: Partial<ProxyCreator>) => {
    return handleRequest<ProxyCreator>(
        () => request.post(`${proxyBaseURL}/`, input, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const updateItem = (id: string, input: Partial<ProxyViewerDetail>) => {
    return handleRequest(
        () => request.patch(`${proxyBaseURL}/${id}`, input, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const deleteByID = (id: string) => {
    return handleRequest<ProxyInterface>(
        () => request.delete(`${proxyBaseURL}/${id}`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const ProxyAPI = {
    detail,
    view,
    newItem,
    updateItem,
    deleteByID
}

export default ProxyAPI