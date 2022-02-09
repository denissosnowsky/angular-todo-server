import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TodoDAO } from 'src/types/dao/create-todo.dao';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

import { Todo, TodoDocument } from './schemas/todo.schema';
import { ExternalTodoTable } from 'src/types/tables/create-todo.table';
import { completeConvert } from 'src/utils/completeConvert';
import { Complete } from 'src/types/types';
import { ImportantEnum } from 'src/types/types';

@Injectable()
export class TodosRepository {
  private findTodosByCompelteAndImportant = async (
    complete: string,
    important: string,
    limit?: number,
    skip?: number,
  ) => {
    return limit
      ? await this.todoModel
          .find()
          .where({
            completed: completeConvert(complete as Complete),
            important: important,
          })
          .limit(limit)
          .skip(skip ? skip : 0)
          .sort({ id: -1 })
      : await this.todoModel
          .find()
          .where({
            completed: completeConvert(complete as Complete),
            important: important,
          })
          .skip(skip ? skip : 0)
          .sort({ id: -1 });
  };

  private findTodosByComplete = async (
    complete: string,
    limit?: number,
    skip?: number,
  ) => {
    return limit
      ? await this.todoModel
          .find()
          .where({ completed: completeConvert(complete as Complete) })
          .limit(limit)
          .skip(skip ? skip : 0)
          .sort({ id: -1 })
      : await this.todoModel
          .find()
          .where({ completed: completeConvert(complete as Complete) })
          .skip(skip ? skip : 0)
          .sort({ id: -1 });
  };

  private findTodosByImportant = async (
    important: string,
    limit?: number,
    skip?: number,
  ) => {
    return limit
      ? await this.todoModel
          .find()
          .where({ important: important })
          .limit(limit)
          .skip(skip ? skip : 0)
          .sort({ id: -1 })
      : await this.todoModel
          .find()
          .where({ important: important })
          .skip(skip ? skip : 0)
          .sort({ id: -1 });
  };

  private findAllTodos = async (limit?: number, skip?: number) => {
    return limit
      ? await this.todoModel
          .find()
          .limit(limit)
          .skip(skip ? skip : 0)
          .sort({ id: -1 })
      : await this.todoModel
          .find()
          .skip(skip ? skip : 0)
          .sort({ id: -1 });
  };

  private getTodosCountByCompelteAndImportant = async (
    complete: string,
    important: string,
  ) => {
    return await this.todoModel
      .where({
        completed: completeConvert(complete as Complete),
        important: important,
      })
      .count();
  };

  private getTodosCountByCompelte = async (complete: string) => {
    return await this.todoModel
      .where({
        completed: completeConvert(complete as Complete),
      })
      .count();
  };

  private getTodosCountByImportant = async (important: string) => {
    return await this.todoModel
      .where({
        important: important,
      })
      .count();
  };

  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    private configService: ConfigService,
  ) {}

  async findTodos(
    limit?: number,
    skip?: number,
    complete?: string,
    important?: string,
  ): Promise<ExternalTodoTable[]> {
    let todos: ExternalTodoTable[];

    if (complete && important) {
      todos = await this.findTodosByCompelteAndImportant(
        complete,
        important,
        limit,
        skip,
      );
    }

    if (complete && !important) {
      todos = await this.findTodosByComplete(complete, limit, skip);
    }

    if (important && !complete) {
      todos = await this.findTodosByImportant(important, limit, skip);
    }

    if (!important && !complete) {
      todos = await this.findAllTodos(limit, skip);
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

  async changeTodo(
    id: number,
    text: string,
    priority: ImportantEnum,
  ): Promise<void> {
    await this.todoModel.findOneAndUpdate(
      { id },
      { title: text, important: priority },
    );
  }

  async getTodoCursor(): Promise<Array<Todo>> {
    return this.todoModel.find().sort({ id: -1 }).limit(1);
  }

  async getExternalData(): Promise<ExternalTodoTable[]> {
    const externalData = await fetch(
      this.configService.get<string>('JSON_SERVER_URI'),
    ).then((data) => data.json() as Promise<ExternalTodoTable[]>);

    await this.todoModel.insertMany(externalData);
    return externalData;
  }

  async getTodosCount(complete?: string, important?: string): Promise<number> {
    let count: number;

    if (complete && important) {
      count = await this.getTodosCountByCompelteAndImportant(
        complete,
        important,
      );
    }
    if (complete && !important) {
      count = await this.getTodosCountByCompelte(complete);
    }
    if (important && !complete) {
      count = await this.getTodosCountByImportant(important);
    }
    if (!complete && !important) {
      count = await this.todoModel.count();
    }
    return count;
  }
}
