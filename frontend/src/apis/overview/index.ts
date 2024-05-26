import pick from 'lodash/pick'
import { handleRequest } from '../handle'
import request from './request'
import { overviewBaseURL } from '../config'
// import { ProxyViewerEndpoint } from './config'
import { AUTHEN_TOKEN_KEY } from '../constants/const'
import Cookie from 'js-cookie'

const HeaderAuth = {
    headers: {
        Authorization: `Bearer ${Cookie.get(AUTHEN_TOKEN_KEY)}`
    }
}

const detail = (id: string) => {
    return handleRequest<ArraySecureLogs>(
        () => request.get(`${overviewBaseURL}/${id}`, HeaderAuth),
        r => {
            return {
                data: r.data.data,
            }
        },
    )
}


const view = (_timerange: string = "7 days") => {
    return handleRequest<Overview>(
        () => request.get(`${overviewBaseURL}?timerange=${_timerange}`, HeaderAuth),
        r => {
            return {
                data: r.data.data
            };
        }
    )
}


const OverviewAPI = {
    detail,
    view,
}

export default OverviewAPI