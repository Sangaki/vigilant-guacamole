export interface TaskI {
    taskId: string,
    name: string,
    description: string,
    priority: number,
    dateTime: Date,
    userId: string,
}

export interface NewTaskI {
    name: string,
    description: string,
    priority: number,
    dateTime: Date,
}
