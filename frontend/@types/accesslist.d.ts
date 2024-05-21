declare global {
    interface AccesslistInterface {
        accesslist_id: string,
        name: string,
        updated_at: any,
    }

    interface BlacklistInterface {
        id: string,
        accesslist_id: string,
        ip: string,
        status: int
    }
}

export { };