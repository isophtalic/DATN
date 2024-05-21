declare global {
    namespace API {
        namespace V1 {
            interface BaseResponse<T> {
                message: string | string[]
                status?: number
                data?: T | T[]
            }

            interface Response<T extends any = any> {
                data?: T
            }

            interface ResponseList<T extends any = any> {
                rows?: T[]
                paging?: {
                    current_page: number
                    limit: number
                    total_page: number
                    total: number
                }
            }

            export type ExpressResponse<T> = Res<BaseResponse<T>>

            export type ExpressResponseList<T> = Res<BaseResponse<ResponseList<T>>>
        }
    }

    import type { CancelTokenSource } from 'axios'

    export type BaseApiFunction<T = any, R = BaseResponse<any>> = (param: BaseParam<T>) => Promise<R>

    export interface BaseResponse<T = any> {
        success?: boolean

        data?: T

        page?: T extends (infer R)[]
        ? {
            current: number

            max: number

            count: number

            limit?: number
        }
        : never

        cancel?: boolean

        status: string | number

        message?: string
    }

    export type PBaseResponse<T = any> = Promise<BaseResponse<T>>

    export interface BaseResponseList<T> extends BaseResponse<T> {
        rows?: T[]

        paging?: {
            current: number

            max: number

            count: number
        }
    }

    export interface BaseResponseServer<T> {
        data: T extends (infer R)[]
        ? {
            rows: T

            paging: {
                next_page?: number
                current_link?: string
                next_link?: string
                current_page?: number
                total_page?: number
                limit?: number
                total?: number
            }
        }
        : T

        error_code: number

        message: string
    }

    export interface BaseResponseListServer<T> {
        data: {
            rows: T[]
            paging: {
                next_page?: number
                current_link?: string
                next_link?: string
                current_page?: number
                total_page?: number
                limit?: number
                count?: number
            }
        }

        error_code: number

        message: string
    }

    export interface BaseParam<T = any> {
        id?: string | number

        authen?: string

        language?: string

        cancelToken?: CancelTokenSource

        input?: T

        page?: number

        limit?: number
    }
}

export { }