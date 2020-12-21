export function getFormattedDateFromString(dateString: string):string {
    const clDate = new Date(dateString);
    return `${clDate.getFullYear()}-${clDate.getMonth()}-${clDate.getDate()}`;
}

export function getFormattedTimeFromString(dateString: string):string {
    const clDate = new Date(dateString.replace('T', ' '));
    const mins = clDate.getMinutes();
    const minutes = mins < 10 ? `0${mins}` : mins;
    return `${clDate.getHours()}:${minutes}`;
}