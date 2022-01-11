import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TodoDTO } from 'src/types/dto/create-todo.dto';

import { Todo } from './schemas/todo.schema';
import { TodosRepository } from './todos.repository';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);

  constructor(private todosRepository: TodosRepository) {}

  async createTodo(todo: TodoDTO): Promise<Todo> {
    this.logger.log('creating todo...');
    try {
      return this.todosRepository.createTodo(todo);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async findAllTodos(): Promise<Todo[]> {
    this.logger.log('finding all todos...');
    try {
      return this.todosRepository.findAllTodos();
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async deleteTodo(todoId: string): Promise<void> {
    this.logger.log('deleting todo...');
    try {
      await this.todosRepository.deleteTodo(todoId);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async completeTodo(todoId: string): Promise<void> {
    this.logger.log('completing todo...');
    try {
      await this.todosRepository.completeTodo(todoId);
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
