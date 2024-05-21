import dotenv from 'dotenv'

dotenv.config();

export const BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:8123"
export const API_KEY = process.env.API_KEY || "aXNvcGh0YWxpYy5jeXJhZGFy"
export const V1 = `${BASE_URL}/api/v1`
export const authBaseURL = `${V1}/auth`
export const proxyBaseURL = `${V1}/proxy`
export const sourceBaseURL = `${V1}/source`
export const accesslistBaseURL = `${V1}/accesslist`
export const blacklistBaseURL = `${V1}/blacklist`
export const destBaseURL = `${V1}/destination`
export const secruleBaseURL = `${V1}/secrule`
export const rulesetBaseURL = `${V1}/ruleset`
export const dataruleBaseURL = `${V1}/data`
export const userBaseURL = `${V1}/user`
export const actionsBaseURL = `${V1}/actions`
export const seclogBaseURL = `${V1}/seclog`
export const overviewBaseURL = `${V1}/overview`
