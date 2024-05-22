import pick from 'lodash/pick'
import { handleRequest } from '../handle'
import request from './request'
import { blacklistBaseURL } from '../config'
// import { ProxyViewerEndpoint } from './config'
import { AUTHEN_TOKEN_KEY } from '../constants/const'
import Cookie from 'js-cookie'

const HeaderAuth = {
    headers: {
        Authorization: `Bearer ${Cookie.get(AUTHEN_TOKEN_KEY)}`
    }
}

const detail = (id: string) => {
    return handleRequest<DataRuleInterface>(
        () => request.get(`${blacklistBaseURL}/${id}`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}


const view = () => {
    return handleRequest<any>(
        () => request.get(`${blacklistBaseURL}`, HeaderAuth),
        r => {
            return {
                data: r.data.data
            };
        }
    )
}

const newItem = (input: Partial<BlacklistInterface>) => {
    const { accesslist_id, ip, status } = pick(input, ['accesslist_id', 'ip', 'status'])
    return handleRequest<BlacklistInterface>(
        () => request.post(`${blacklistBaseURL}`, { accesslist_id, ip, status }, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const updateItem = (id: string, ruleUpdated: BlacklistInterface) => {
    return
}

const deleteByID = (id: string) => {
    return handleRequest<BlacklistInterface>(
        () => request.delete(`${blacklistBaseURL}/${id}`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const BlacklistAPI = {
    detail,
    view,
    newItem,
    updateItem,
    deleteByID
}

export default BlacklistAPI