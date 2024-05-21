declare global {
    interface SecRuleInterface {
        secrule_id: string,
        created_at: any,
        updated_at: any,
        name: string,
        debug_log_level: number,
    }

    interface RuleSetInterface {
        rule_id: string,
        secrule_id: string,
        created_at: any,
        updated_at: any,
        id: number,
        file: string
        content: string,
        status: number
    }

    interface DataRuleInterface {
        data_id: string,
        secrule_id: string,
        created_at: any,
        updated_at: any,
        name: string,
        description: string,
        content: string,
    }
}

export { };