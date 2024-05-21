const DateTimeFormat = (value: any): string => {
    let dateObject = new Date()
    try {
        dateObject = new Date(value);
    } catch (error) {
        console.log(error);
        return ""
    }

    const day = String(dateObject.getDate()).padStart(2, '0'); // Zero-pad day
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = dateObject.getFullYear();
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');
    const seconds = String(dateObject.getSeconds()).padStart(2, '0');
    const milliseconds = String(dateObject.getMilliseconds()).padStart(3, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export const DateTime = {
    DateTimeFormat
}