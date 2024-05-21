declare global {
    type EventCount = {
        field: string,
        count: int,
    }

    interface Overview {
        total_host: number,
        total_secure_event: number,
        top_attack_type: EventCount[],
        top_rule_id: EventCount[],
        top_by_host: EventCount[],
        top_by_source_attack: EventCount[]
    }
}

export { };