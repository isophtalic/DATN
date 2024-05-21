declare global {
    interface SourceInterface {
        source_id: string,
        proxy_id: string,
        created_at: any,
        updated_at: any,
        hostname: string,
        port: string,
    }

    type SourceViewerDetail = {
        source_id: string,
        proxy_id: string,
        created_at: any,
        updated_at: any,
        hostname: string,
        port: string,
        destination: DestinationInterface
    }
}

export { };