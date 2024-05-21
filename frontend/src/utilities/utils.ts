export const GetArrayDataByField = (input: EventCount[], f: keyof EventCount): any[] => {
    return input.map(value => value[f]);
}
