export function getFormattedDateFromString(dateString: Date):string {
    const clDate = new Date(dateString);
    return `${clDate.getFullYear()}-${clDate.getMonth()}-${clDate.getDate()}`;
}

export function getFormattedTimeFromString(dateString: Date):string {
    const clDate = new Date(dateString);
    const mins = clDate.getMinutes()
    const minutes = mins < 10 ? `0${mins}` : mins;
    return `${clDate.getHours()}:${minutes}`;
}