import { TodoDAO } from 'src/types/dao/create-todo.dao';
import { ImportantEnum } from 'src/types/types';
import { Todo } from './schemas/todo.schema';
import { TodosService } from './todos.service';
export declare class TodosController {
    private readonly todosService;
    constructor(todosService: TodosService);
    createTodo(newTodo: TodoDAO, req: any): Promise<Todo>;
    completeTodo(todoId: string, req: any): Promise<void>;
    changeTodo(todoId: string, body: {
        text: string;
        priority: ImportantEnum;
    }, req: any): Promise<void>;
    deleteTodo(ids: Array<number>, req: any): Promise<void>;
    findTodos(req: any, limit?: number, skip?: number, complete?: string, important?: string): Promise<{
        todos: Todo[];
        count: number;
    }>;
    getTodoCursor(req: any): Promise<number>;
}
