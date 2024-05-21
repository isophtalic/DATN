declare global {
    interface SecLog {
        sec_id: string;
        created_at: string; // Assuming time.Time is represented as a string
        client_ip: string;
        host: string;
        method: string;
        proto: string;
        uri: string;
        headers: string;
        body: string;
        form: string; // Optional if Form can be null
        mess: string,
        rule_id: string,
        secure_logs: string;
    }

    interface SecurityLog {
        rule_engine: boolean;
        filename: string;
        line: number;
        id: number;
        rev: string;
        msg: string;
        data: string;
        serverity: number; // Corrected typo: serverity -> severity
        ver: string;
        maturity: number;
        accuracy: number;
        tags: string;
        raw: string;
    }

    interface SecureLogsViewer {
        sec_id: string;
        created_at: string; // Assuming time.Time is represented as a string
        client_ip: string;
        host: string;
        method: string;
        proto: string;
        uri: string;
        headers: string;
        body: string;
        form: string;
        mess: string,
        rule_id: string,
    }

    interface ArraySecureLogs extends SecureLogsViewer {
        secure_logs: SecurityLog[];
    }
}

export { };