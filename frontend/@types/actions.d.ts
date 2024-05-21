declare global {
    interface ActionsInterface {
        id: string,
        name: string,
        created_at: any,
        updated_at: any,
        initiated_by: string,
        target: string,
        target_id: string,
        changes: string,
        original: string,
    }

    type ActionsView = {
        id: string,
        name: string,
        created_at: any,
        updated_at: any,
        initiated_by: string,
        target: string,
    }
}

export { };