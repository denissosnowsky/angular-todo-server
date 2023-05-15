import { Model } from 'mongoose';
import { TodoDAO } from 'src/types/dao/create-todo.dao';
import { ConfigService } from '@nestjs/config';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { ExternalTodoTable } from 'src/types/tables/create-todo.table';
import { ImportantEnum } from 'src/types/types';
export declare class TodosRepository {
    private todoModel;
    private configService;
    private findTodosByCompelteAndImportant;
    private findTodosByComplete;
    private findTodosByImportant;
    private findAllTodos;
    private getTodosCountByCompelteAndImportant;
    private getTodosCountByCompelte;
    private getTodosCountByImportant;
    constructor(todoModel: Model<TodoDocument>, configService: ConfigService);
    findTodos(userId: string, limit?: number, skip?: number, complete?: string, important?: string): Promise<ExternalTodoTable[]>;
    createTodo(createTodoDao: TodoDAO): Promise<Todo>;
    deleteTodo(userId: string, ids: Array<number>): Promise<void>;
    completeTodo(userId: string, id: string): Promise<void>;
    changeTodo(userId: string, id: string, text: string, priority: ImportantEnum): Promise<void>;
    getTodoCursor(userId: string): Promise<Array<Todo>>;
    getTodosCount(userId: string, complete?: string, important?: string): Promise<number>;
}
