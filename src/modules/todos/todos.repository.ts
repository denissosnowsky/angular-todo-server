import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TodoDAO } from 'src/types/dao/create-todo.dao';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

import { Todo, TodoDocument } from './schemas/todo.schema';
import {
  ExternalTodoTable,
  TodoTable,
} from 'src/types/tables/create-todo.table';

@Injectable()
export class TodosRepository {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    private configService: ConfigService,
  ) {}

  async createTodo(createTodoDao: TodoDAO): Promise<Todo> {
    const createdTodo = new this.todoModel({
      ...createTodoDao,
      completed: false,
    });
    return createdTodo.save();
  }

  async findTodos(limit?: number, skip?: number): Promise<Todo[]> {
    return limit
      ? this.todoModel.find().limit(limit).skip(skip).sort({ id: -1 })
      : this.todoModel.find().sort({ id: -1 });
  }

  async deleteTodo(ids: Array<number>): Promise<void> {
    await this.todoModel.deleteMany({ id: { $in: ids } });
  }

  async completeTodo(id: number): Promise<void> {
    const todo = await this.todoModel.findOne({ id });
    await this.todoModel.findOneAndUpdate(
      { id },
      { completed: !todo.completed },
    );
  }

  async changeTodo(id: number, text: string): Promise<void> {
    await this.todoModel.findOneAndUpdate({ id }, { title: text });
  }

  async getTodoCursor(): Promise<Array<TodoTable>> {
    return this.todoModel.find().sort({ id: -1 }).limit(1);
  }

  async getExternalData(): Promise<ExternalTodoTable[]> {
    const externalData = await fetch(
      this.configService.get<string>('JSON_SERVER_URI'),
    ).then((data) => data.json() as Promise<ExternalTodoTable[]>);
    await this.todoModel.insertMany(externalData);
    return externalData;
  }

  async getTodosCount(): Promise<number> {
    return this.todoModel.count();
  }
}
