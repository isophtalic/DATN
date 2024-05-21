const ConvertArraySecLog_to_SecLog = (input: ArraySecureLogs): SecLog => {
    return {
        ...input,
        secure_logs: JSON.stringify(input.secure_logs),
    }
}

export const Utils = {
    ConvertArraySecLog_to_SecLog
}