import { TodoDAO } from 'src/types/dao/create-todo.dao';
import { ImportantEnum } from 'src/types/types';
import { Todo } from './schemas/todo.schema';
import { TodosRepository } from './todos.repository';
export declare class TodosService {
    private todosRepository;
    private isDatabaseInited;
    private readonly logger;
    private getDBTodosAfterInitialization;
    private initializeDatabase;
    constructor(todosRepository: TodosRepository);
    createTodo(todo: TodoDAO): Promise<Todo>;
    findTodos(userId: string, limit?: number, skip?: number, complete?: string, important?: string): Promise<{
        todos: Todo[];
        count: number;
    }>;
    deleteTodo(userId: string, ids: Array<number>): Promise<void>;
    completeTodo(userId: string, id: string): Promise<void>;
    changeTodo(userId: string, id: string, text: string, priority: ImportantEnum): Promise<void>;
    getTodoCursor(userId: string): Promise<number>;
}
