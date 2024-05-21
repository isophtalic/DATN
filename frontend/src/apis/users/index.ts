import pick from 'lodash/pick'
import { handleRequest } from '../handle'
import request from './request'
import { userBaseURL } from '../config'
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
    return handleRequest<UserInput>(
        () => request.get(`${userBaseURL}/${id}`, HeaderAuth),
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
        () => request.get(`${userBaseURL}?page=${param.page}&limit=${param.limit}`, HeaderAuth),
        r => {
            return {
                data: r.data.data
            };
        }
    )
}

const newItem = (input: UserInput) => {
    const { username, password, role } = pick(input, ['username', 'password', 'role'])
    return handleRequest<AccesslistInterface>(
        () => request.post(`${userBaseURL}`, { username, password, role }, HeaderAuth),
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

const UserAPI = {
    detail,
    view,
    newItem,
    updateItem,

}

export default UserAPI