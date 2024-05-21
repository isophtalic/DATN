import pick from 'lodash/pick'
import { handleRequest } from '../handle'
import request from './request'
import { dataruleBaseURL } from '../config'
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
        () => request.get(`${dataruleBaseURL}/${id}`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}


const view = () => {
    return handleRequest<any>(
        () => request.get(`${dataruleBaseURL}`, HeaderAuth),
        r => {
            return {
                data: r.data.data
            };
        }
    )
}

const newItem = (input: Partial<DataRuleInterface>) => {
    const { name, description, content, secrule_id } = pick(input, ['name', 'description', 'content', 'secrule_id'])
    return handleRequest<DataRuleInterface>(
        () => request.post(`${dataruleBaseURL}`, { name, description, content, secrule_id }, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}

const updateItem = (id: string, ruleUpdated: DataRuleInterface) => {
    return
}

const DataRuleAPI = {
    detail,
    view,
    newItem,
    updateItem
}

export default DataRuleAPI