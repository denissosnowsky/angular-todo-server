import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TodoDTO } from 'src/types/dto/create-todo.dto';

import { Todo, TodoDocument } from './schemas/todo.schema';

@Injectable()
export class TodosRepository {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async createTodo(createTodoDto: TodoDTO): Promise<Todo> {
    const createdTodo = new this.todoModel(createTodoDto);
    return createdTodo.save();
  }

  async findAllTodos(): Promise<Todo[]> {
    return this.todoModel.find().exec();
  }

  async deleteTodo(id: string): Promise<void> {
    await this.todoModel.findByIdAndRemove(id);
  }

  async completeTodo(id: string): Promise<void> {
    await this.todoModel.findByIdAndUpdate(id, { completed: true });
  }
}
