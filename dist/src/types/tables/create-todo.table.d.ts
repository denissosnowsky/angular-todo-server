import { ImportantEnum } from '../types';
export declare type TodoTable = {
    userId: string;
    id: number;
    title: string;
    completed: boolean;
    important: ImportantEnum;
    _id: string;
};
export declare type ExternalTodoTable = Omit<TodoTable, '_id'>;
