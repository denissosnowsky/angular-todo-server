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
  private initializeDatabase = async (
    todosCount: number,
    limit: number,
    skip: number,
    complete: string,
    important: string,
  ) => {
    if (todosCount) {
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
    } else {
      const externalData = await this.todosRepository.getExternalData();
      if (externalData.length > 0) {
        this.isDatabaseInited = true;
        const todos = limit ? externalData.slice(0, limit) : externalData;
        if (complete) {
          switch (complete) {
            case 'complete':
              todos.filter((item) => item.completed);
              break;
            case 'uncomplete':
              todos.filter((item) => !item.completed);
              break;
          }
        }
        if (important) {
          switch (important) {
            case 'high':
              todos.filter((item) => item.important === 'high');
              break;
            case 'low':
              todos.filter((item) => item.important === 'low');
              break;
            case 'normal':
              todos.filter((item) => item.important === 'normal');
              break;
            case 'none':
              todos.filter((item) => item.important === '');
              break;
          }
        }
        return {
          todos: todos,
          count: await this.todosRepository.getTodosCount(complete, important),
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
      } else {
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
