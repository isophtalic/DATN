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



const view = (pagination: PaginationState, _valueSeach: string = "") => {
    const param = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize
    }
    return handleRequest<any>(
        () => request.get(`${userBaseURL}?page=${param.page}&limit=${param.limit}&search=${_valueSeach}`, HeaderAuth),
        r => {
            return {
                data: r.data.data
            };
        }
    )
}

const newItem = (input: UserInput) => {
    const { username, password, email } = pick(input, ['username', 'password', 'email'])
    return handleRequest<UserInput>(
        () => request.post(`${userBaseURL}`, { username, password, email }, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const changePassword = (id: string, input: ChangePassword) => {
    console.log("🚀 ~ changePassword ~ HeaderAuth:", HeaderAuth)
    return handleRequest<ChangePassword>(
        () => request.post(`${userBaseURL}/${id}/change-password`, input, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const deleteByID = (id: string) => {
    return handleRequest<UserInput>(
        () => request.delete(`${userBaseURL}/${id}/delete`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const UserAPI = {
    detail,
    view,
    newItem,
    deleteByID,
    changePassword
}

export default UserAPI