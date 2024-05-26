import pick from 'lodash/pick'
import { handleRequest } from '../handle'
import request from './request'
import { actionsBaseURL } from '../config'
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
    return handleRequest<ActionsInterface>(
        () => request.get(`${actionsBaseURL}/detail/${id}`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}


const showByTargetID = (id: string) => {
    return handleRequest<any>(
        () => request.get(`${actionsBaseURL}/${id}/proxies`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const view = () => {
    return handleRequest<any>(
        () => request.get(`${actionsBaseURL}`, HeaderAuth),
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
        () => request.get(`${actionsBaseURL}?page=${param.page}&limit=${param.limit}&search=${_valueSearch}&sort=${"created_at desc"}`, HeaderAuth),
        r => {
            return {
                data: r.data.data
            };
        }
    )
}


const ActionsAPI = {
    detail,
    view,
    showByTargetID,
    list
}

export default ActionsAPI