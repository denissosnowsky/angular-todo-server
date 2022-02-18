import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TodoDAO } from 'src/types/dao/create-todo.dao';
import { ConfigService } from '@nestjs/config';

import { Todo, TodoDocument } from './schemas/todo.schema';
import { ExternalTodoTable } from 'src/types/tables/create-todo.table';
import { completeConvert } from 'src/utils/completeConvert';
import { Complete } from 'src/types/types';
import { ImportantEnum } from 'src/types/types';

@Injectable()
export class TodosRepository {
  private findTodosByCompelteAndImportant = async (
    userId: string,
    complete: string,
    important: string,
    limit?: number,
    skip?: number,
  ) => {
    return limit
      ? await this.todoModel
          .find()
          .where({
            userId,
            completed: completeConvert(complete as Complete),
            important: important,
          })
          .limit(limit)
          .skip(skip ? skip : 0)
          .sort({ id: -1 })
      : await this.todoModel
          .find()
          .where({
            userId,
            completed: completeConvert(complete as Complete),
            important: important,
          })
          .skip(skip ? skip : 0)
          .sort({ id: -1 });
  };

  private findTodosByComplete = async (
    userId: string,
    complete: string,
    limit?: number,
    skip?: number,
  ) => {
    return limit
      ? await this.todoModel
          .find()
          .where({
            userId,
            completed: completeConvert(complete as Complete),
          })
          .limit(limit)
          .skip(skip ? skip : 0)
          .sort({ id: -1 })
      : await this.todoModel
          .find()
          .where({
            userId,
            completed: completeConvert(complete as Complete),
          })
          .skip(skip ? skip : 0)
          .sort({ id: -1 });
  };

  private findTodosByImportant = async (
    userId: string,
    important: string,
    limit?: number,
    skip?: number,
  ) => {
    return limit
      ? await this.todoModel
          .find()
          .where({ userId, important: important })
          .limit(limit)
          .skip(skip ? skip : 0)
          .sort({ id: -1 })
      : await this.todoModel
          .find()
          .where({ userId, important: important })
          .skip(skip ? skip : 0)
          .sort({ id: -1 });
  };

  private findAllTodos = async (
    userId: string,
    limit?: number,
    skip?: number,
  ) => {
    return limit
      ? await this.todoModel
          .find()
          .where({ userId })
          .limit(limit)
          .skip(skip ? skip : 0)
          .sort({ id: -1 })
      : await this.todoModel
          .find()
          .where({ userId })
          .skip(skip ? skip : 0)
          .sort({ id: -1 });
  };

  private getTodosCountByCompelteAndImportant = async (
    userId: string,
    complete: string,
    important: string,
  ) => {
    return await this.todoModel
      .where({
        userId,
        completed: completeConvert(complete as Complete),
        important: important,
      })
      .count();
  };

  private getTodosCountByCompelte = async (
    userId: string,
    complete: string,
  ) => {
    return await this.todoModel
      .where({
        userId,
        completed: completeConvert(complete as Complete),
      })
      .count();
  };

  private getTodosCountByImportant = async (
    userId: string,
    important: string,
  ) => {
    return await this.todoModel
      .where({
        userId,
        important: important,
      })
      .count();
  };

  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    private configService: ConfigService,
  ) {}

  async findTodos(
    userId: string,
    limit?: number,
    skip?: number,
    complete?: string,
    important?: string,
  ): Promise<ExternalTodoTable[]> {
    let todos: ExternalTodoTable[];

    if (complete && important) {
      todos = await this.findTodosByCompelteAndImportant(
        userId,
        complete,
        important,
        limit,
        skip,
      );
    }

    if (complete && !important) {
      todos = await this.findTodosByComplete(userId, complete, limit, skip);
    }

    if (important && !complete) {
      todos = await this.findTodosByImportant(userId, important, limit, skip);
    }

    if (!important && !complete) {
      todos = await this.findAllTodos(userId, limit, skip);
    }

    return todos;
  }

  async createTodo(createTodoDao: TodoDAO): Promise<Todo> {
    const createdTodo = new this.todoModel({
      ...createTodoDao,
      completed: false,
    });
    return createdTodo.save();
  }

  async deleteTodo(userId: string, ids: Array<number>): Promise<void> {
    await this.todoModel.where({ userId }).deleteMany({ id: { $in: ids } });
  }

  async completeTodo(userId: string, id: string): Promise<void> {
    const todo = await this.todoModel.where({ userId }).findOne({ id });
    await this.todoModel
      .where({ userId })
      .findOneAndUpdate({ id }, { completed: !todo.completed });
  }

  async changeTodo(
    userId: string,
    id: string,
    text: string,
    priority: ImportantEnum,
  ): Promise<void> {
    await this.todoModel
      .where({ userId })
      .findOneAndUpdate({ id }, { title: text, important: priority });
  }

  async getTodoCursor(userId: string): Promise<Array<Todo>> {
    return this.todoModel.where({ userId }).find().sort({ id: -1 }).limit(1);
  }

  async getTodosCount(
    userId: string,
    complete?: string,
    important?: string,
  ): Promise<number> {
    let count: number;

    if (complete && important) {
      count = await this.getTodosCountByCompelteAndImportant(
        userId,
        complete,
        important,
      );
    }
    if (complete && !important) {
      count = await this.getTodosCountByCompelte(userId, complete);
    }
    if (important && !complete) {
      count = await this.getTodosCountByImportant(userId, important);
    }
    if (!complete && !important) {
      count = await this.todoModel
        .where({
          userId,
        })
        .count();
    }
    return count;
  }
}
