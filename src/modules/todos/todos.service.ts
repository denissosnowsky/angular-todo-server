import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { TodoDAO } from 'src/types/dao/create-todo.dao';
import { ImportantEnum } from 'src/types/types';
import { Todo } from './schemas/todo.schema';
import { TodosRepository } from './todos.repository';

@Injectable()
export class TodosService {
  private isDatabaseInited = false;
  private readonly logger = new Logger(TodosService.name);

  private getDBTodosAfterInitialization = async (
    userId: string,
    todosCount: number,
    limit: number,
    skip: number,
    complete: string,
    important: string,
  ) => {
    this.isDatabaseInited = true;
    return {
      todos: await this.todosRepository.findTodos(
        userId,
        limit,
        skip,
        complete,
        important,
      ),
      count: todosCount,
    };
  };

  private initializeDatabase = async (
    userId: string,
    todosCount: number,
    limit: number,
    skip: number,
    complete: string,
    important: string,
  ) => {
    if (todosCount) {
      return this.getDBTodosAfterInitialization(
        userId,
        todosCount,
        limit,
        skip,
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
    userId: string,
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
            userId,
            limit,
            skip,
            complete,
            important,
          ),
          count: await this.todosRepository.getTodosCount(
            userId,
            complete,
            important,
          ),
        };
      }

      const todosCount = await this.todosRepository.getTodosCount(
        userId,
        complete,
        important,
      );

      return this.initializeDatabase(
        userId,
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

  async deleteTodo(userId: string, ids: Array<number>): Promise<void> {
    this.logger.log('deleting todo...');
    try {
      await this.todosRepository.deleteTodo(userId, ids);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async completeTodo(userId: string, id: string): Promise<void> {
    this.logger.log('completing todo...');
    try {
      await this.todosRepository.completeTodo(userId, id);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async changeTodo(
    userId: string,
    id: string,
    text: string,
    priority: ImportantEnum,
  ): Promise<void> {
    this.logger.log('changing todo...');
    try {
      await this.todosRepository.changeTodo(userId, id, text, priority);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getTodoCursor(userId: string): Promise<number> {
    this.logger.log('getting cursor...');
    try {
      const res: Array<Todo> = await this.todosRepository.getTodoCursor(userId);
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
