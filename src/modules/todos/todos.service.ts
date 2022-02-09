import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { TodoDAO } from 'src/types/dao/create-todo.dao';
import { ExternalTodoTable } from 'src/types/tables/create-todo.table';
import { ImportantEnum } from 'src/types/types';
import { Todo } from './schemas/todo.schema';
import { TodosRepository } from './todos.repository';
import { filterByCompletence } from './utils/filterByCompletence';
import { filterByImportance } from './utils/filterByImportance';

@Injectable()
export class TodosService {
  private isDatabaseInited = false;
  private readonly logger = new Logger(TodosService.name);

  private getDBTodosAfterInitialization = async (
    todosCount: number,
    limit: number,
    skip: number,
    complete: string,
    important: string,
  ) => {
    this.isDatabaseInited = true;
    return {
      todos: await this.todosRepository.findTodos(
        limit,
        skip,
        complete,
        important,
      ),
      count: todosCount,
    };
  };

  private getExtenalTodosAfterInitializationIfExist = async (
    externalData: ExternalTodoTable[],
    limit: number,
    complete: string,
    important: string,
  ) => {
    this.isDatabaseInited = true;
    const todos = limit ? externalData.slice(0, limit) : externalData;

    if (complete) {
      filterByCompletence(complete, todos);
    }
    if (important) {
      filterByImportance(important, todos);
    }
    return {
      todos: todos,
      count: await this.todosRepository.getTodosCount(complete, important),
    };
  };

  private initializeDatabase = async (
    todosCount: number,
    limit: number,
    skip: number,
    complete: string,
    important: string,
  ) => {
    if (todosCount) {
      return this.getDBTodosAfterInitialization(
        todosCount,
        limit,
        skip,
        complete,
        important,
      );
    }

    const externalData = await this.todosRepository.getExternalData();

    if (externalData.length > 0) {
      return this.getExtenalTodosAfterInitializationIfExist(
        externalData,
        limit,
        complete,
        important,
      );
    }

    return {
      todos: [],
      count: 0,
    };
  };

  constructor(private todosRepository: TodosRepository) {}

  async createTodo(todo: TodoDAO): Promise<Todo> {
    this.logger.log('creating todo...');
    try {
      return this.todosRepository.createTodo(todo);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async findTodos(
    limit?: number,
    skip?: number,
    complete?: string,
    important?: string,
  ): Promise<{
    todos: Todo[];
    count: number;
  }> {
    this.logger.log('finding all todos...');
    try {
      if (this.isDatabaseInited) {
        return {
          todos: await this.todosRepository.findTodos(
            limit,
            skip,
            complete,
            important,
          ),
          count: await this.todosRepository.getTodosCount(complete, important),
        };
      }

      const todosCount = await this.todosRepository.getTodosCount(
        complete,
        important,
      );

      return this.initializeDatabase(
        todosCount,
        limit,
        skip,
        complete,
        important,
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async deleteTodo(ids: Array<number>): Promise<void> {
    this.logger.log('deleting todo...');
    try {
      await this.todosRepository.deleteTodo(ids);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async completeTodo(id: number): Promise<void> {
    this.logger.log('completing todo...');
    try {
      await this.todosRepository.completeTodo(id);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async changeTodo(
    id: number,
    text: string,
    priority: ImportantEnum,
  ): Promise<void> {
    this.logger.log('changing todo...');
    try {
      await this.todosRepository.changeTodo(id, text, priority);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getTodoCursor(): Promise<number> {
    this.logger.log('getting cursor...');
    try {
      const res: Array<Todo> = await this.todosRepository.getTodoCursor();
      if (res[0]) {
        return res[0].id;
      } else {
        return 0;
      }
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
