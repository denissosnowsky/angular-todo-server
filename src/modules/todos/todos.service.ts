import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { TodoDAO } from 'src/types/dao/create-todo.dao';
import { Todo } from './schemas/todo.schema';
import { TodosRepository } from './todos.repository';

@Injectable()
export class TodosService {
  private isDatabaseInited = false;
  private readonly logger = new Logger(TodosService.name);
  private initializeDatabase = async (
    todosCount: number,
    limit: number,
    skip: number,
  ) => {
    if (todosCount) {
      this.isDatabaseInited = true;
      return {
        todos: await this.todosRepository.findTodos(limit, skip),
        count: todosCount,
      };
    } else {
      const externalData = await this.todosRepository.getExternalData();
      if (externalData.length > 0) {
        this.isDatabaseInited = true;
        return {
          todos: limit ? externalData.slice(0, limit) : externalData,
          count: await this.todosRepository.getTodosCount(),
        };
      } else {
        return {
          todos: [],
          count: 0,
        };
      }
    }
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
  ): Promise<{
    todos: Todo[];
    count: number;
  }> {
    this.logger.log('finding all todos...');
    try {
      if (this.isDatabaseInited) {
        return {
          todos: await this.todosRepository.findTodos(limit, skip),
          count: await this.todosRepository.getTodosCount(),
        };
      } else {
        const todosCount = await this.todosRepository.getTodosCount();
        return this.initializeDatabase(todosCount, limit, skip);
      }
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

  async changeTodo(id: number, text: string): Promise<void> {
    this.logger.log('changing todo...');
    try {
      await this.todosRepository.changeTodo(id, text);
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
