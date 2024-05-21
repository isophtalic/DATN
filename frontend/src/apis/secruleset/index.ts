import pick from 'lodash/pick'
import { handleRequest } from '../handle'
import request from './request'
import { secruleBaseURL } from '../config'
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
    return handleRequest<SecRuleInterface>(
        () => request.get(`${secruleBaseURL}/${id}`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const showRuleSets = (id: string) => {
    return handleRequest<any>(
        () => request.get(`${secruleBaseURL}/${id}/ruleset`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const showDataRule = (id: string) => {
    return handleRequest<any>(
        () => request.get(`${secruleBaseURL}/${id}/data`, HeaderAuth),
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
        () => request.get(`${secruleBaseURL}?page=${param.page}&limit=${param.limit}`, HeaderAuth),
        r => {
            return {
                data: r.data.data
            };
        }
    )
}

const newItem = (input: Partial<SecRuleInterface>) => {
    const { name, debug_log_level } = pick(input, ['name', "debug_log_level"])
    return handleRequest<SecRuleInterface>(
        () => request.post(`${secruleBaseURL}`, { name, debug_log_level }, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const deleteByID = (id: string) => {
    return handleRequest<SecRuleInterface>(
        () => request.delete(`${secruleBaseURL}/${id}`, HeaderAuth),
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

const SecRuleAPI = {
    detail,
    view,
    showRuleSets,
    showDataRule,
    newItem,
    updateItem,
    deleteByID
}

export default SecRuleAPI