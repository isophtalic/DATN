declare global {
    interface DestinationInterface {
        destination_id: string,
        source_id: string,
        scheme: "http" | "https" | "ftp",
        ip: string,
        forward_port: string,
        created_at: any,
        updated_at: any,
    }

    type DestinationViewer = {
        destination_id: string,
        source_id: string,
        scheme: string,
        ip: string,
        forward_port: string,
        created_at: any,
        updated_at: any,
    }
}

export { };