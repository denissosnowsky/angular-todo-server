import { Document } from 'mongoose';
import { ImportantEnum } from 'src/types/types';
export declare type TodoDocument = Todo & Document;
export declare class Todo {
    userId: string;
    id: number;
    title: string;
    completed: boolean;
    important: ImportantEnum;
}
export declare const TodoSchema: import("mongoose").Schema<Document<Todo, any, any>, import("mongoose").Model<Document<Todo, any, any>, any, any, any>, any, any>;
