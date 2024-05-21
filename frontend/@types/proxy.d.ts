import { pick } from 'lodash/pick';
declare global {
    interface ProxyInterface {
        proxy_id: string,
        status: true | false,
        cache: true | false,
        accesslist_id: string,
        secrule_id: string,
        created_at: any,
        updated_at: any,
    }

    type ProxyViewer = {
        proxy_id: string,
        status: true | false,
        cache: boolean,
        accesslist_id: string,
        secrule_id: string,
        created_at: any,
        updated_at: any,
        hostname: string,
        port: string,
        scheme: "https" | "http" | "ftp",
        ip: string,
        forward_port: string,
        rule: string,
        debug_log_level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
        accesslist?: string
    }

    type ArrayProxyViewer = ProxyViewer[]

    type ProxyViewerDetail = {
        proxy_id: string,
        status: true | false,
        cache: boolean,
        accesslist_id: string,
        secrule_id: string,
        created_at: any,
        updated_at: any,
        source: SourceInterface,
        destination: DestinationInterface,
        secrule: SecRuleInterface,
        accesslist: AccesslistInterface
    }

    type ProxyCreator = pick<ProxyViewerDetail, "status", "cache", "accesslist_id", "secrule_id", "source", "destination">
}

export { };