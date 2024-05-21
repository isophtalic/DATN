import pick from 'lodash/pick'
import { handleRequest } from '../handle'
import request from './request'
import { rulesetBaseURL } from '../config'
// import { ProxyViewerEndpoint } from './config'
import { AUTHEN_TOKEN_KEY } from '../constants/const'
import Cookie from 'js-cookie'

const HeaderAuth = {
    headers: {
        Authorization: `Bearer ${Cookie.get(AUTHEN_TOKEN_KEY)}`
    }
}

const detail = (id: string) => {
    return handleRequest<RuleSetInterface>(
        () => request.get(`${rulesetBaseURL}/${id}`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}


const view = () => {
    return handleRequest<any>(
        () => request.get(`${rulesetBaseURL}`, HeaderAuth),
        r => {
            return {
                data: r.data.data
            };
        }
    )
}

const newItem = (input: Partial<RuleSetInterface>) => {
    const { id, file, content, secrule_id } = pick(input, ['id', 'file', 'content', 'secrule_id'])
    return handleRequest<SecRuleInterface>(
        () => request.post(`${rulesetBaseURL}`, { id, file, content, secrule_id }, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const updateItem = (id: string, ruleUpdated: RuleSetInterface) => {
    return
}

const RuleAPI = {
    detail,
    view,
    newItem,
    updateItem
}

export default RuleAPI