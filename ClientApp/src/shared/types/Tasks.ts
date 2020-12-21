export interface TaskI {
    taskId: string,
    name: string,
    description: string,
    priority: number,
    dateTime: string,
    userId: string,
}

export interface NewTaskI {
    name: string,
    description: string,
    priority: number,
    dateTime: Date,
}
