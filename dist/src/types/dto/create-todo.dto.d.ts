import { ImportantEnum } from '../types';
export declare type TodoDTO = {
    userId: string;
    id: number;
    title: string;
    completed: boolean;
    important: ImportantEnum;
};
