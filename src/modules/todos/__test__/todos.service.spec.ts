import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TodoDAO } from 'src/types/dao/create-todo.dao';
import { getModelToken } from '@nestjs/mongoose';

import { Todo } from '../schemas/todo.schema';
import { TodosRepository } from '../todos.repository';
import { TodosService } from '../todos.service';
import { InternalServerErrorException } from '@nestjs/common';

class ConfigServiceMock {
  get(key: string): string {
    switch (key) {
      case 'MONGODB_URI':
        return 'mock';
      case 'JSON_SERVER_URI':
        return 'mock';
    }
  }
}

const todoModelMock = {};

describe('Todos Service', () => {
  let todosRepository: TodosRepository;
  let todosService: TodosService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TodosService,
        TodosRepository,
        { provide: ConfigService, useClass: ConfigServiceMock },
        {
          provide: getModelToken(Todo.name),
          useValue: todoModelMock,
        },
      ],
    }).compile();

    todosService = moduleRef.get<TodosService>(TodosService);
    todosRepository = moduleRef.get<TodosRepository>(TodosRepository);
  });

  describe('Create todo method options', () => {
    let todoBodytoCreate: TodoDAO;
    let createdTodo: Todo;

    beforeEach(() => {
      todoBodytoCreate = {
        title: 'Play Cards',
        id: 13,
        userId: 1,
      };
      createdTodo = {
        completed: false,
        title: todoBodytoCreate.title,
        id: todoBodytoCreate.id,
        userId: todoBodytoCreate.userId,
      };
    });

    it('todos service should call createTodo repository method and return new todo', async () => {
      // Given
      const createTodoSpy = jest
        .spyOn(todosRepository, 'createTodo')
        .mockResolvedValue(createdTodo);
      // When
      const response: Todo = await todosService.createTodo(todoBodytoCreate);
      // Then
      expect(createTodoSpy).toBeCalledTimes(1);
      expect(response).toEqual(createdTodo);
    });

    it('todos service should call createTodo and fire exception when method failed', async () => {
      // Given
      jest
        .spyOn(todosRepository, 'createTodo')
        .mockRejectedValue(new Error('Internal Server Error'));
      // Then
      await expect(todosService.createTodo(todoBodytoCreate)).rejects.toEqual(
        new InternalServerErrorException(),
      );
    });
  });

  describe('Find todos method options', () => {
    let limit: number;
    let skip: number;
    let fetchedTodos: Todo[];
    let findTodosSpy;

    beforeEach(() => {
      limit = 1;
      skip = 0;
      fetchedTodos = [
        {
          completed: false,
          title: 'title',
          id: 1,
          userId: 1,
        },
      ];
      findTodosSpy = jest
        .spyOn(todosRepository, 'findTodos')
        .mockResolvedValue(fetchedTodos);
    });

    it('todos service should call findTodos repository method and return fethced todos when db is initialized', async () => {
      // Given
      jest.mock('../todos.service', () => {
        const originalModule = jest.requireActual('../todos.service');
        return {
          __esModule: true,
          ...originalModule,
          isDatabaseInited: true,
        };
      });
      const todosCount = 100;
      const getTodosCountSpy = jest
        .spyOn(todosRepository, 'getTodosCount')
        .mockResolvedValue(todosCount);
      // When
      const responseWithParams = await todosService.findTodos(limit, skip);
      const responseWithoutParams = await todosService.findTodos();
      // Then
      expect(findTodosSpy).toBeCalledTimes(2);
      expect(getTodosCountSpy).toBeCalledTimes(2);
      expect(responseWithParams).toEqual({
        todos: fetchedTodos,
        count: todosCount,
      });
      expect(responseWithoutParams).toEqual({
        todos: fetchedTodos,
        count: todosCount,
      });
    });

    it('todos service should call findTodos repository method and return fethced todos when db is not initialized but db is not empty', async () => {
      // Given
      jest.mock('../todos.service', () => {
        const originalModule = jest.requireActual('../todos.service');
        return {
          __esModule: true,
          ...originalModule,
          isDatabaseInited: false,
        };
      });
      const todosCount = 100;
      const getTodosCountSpy = jest
        .spyOn(todosRepository, 'getTodosCount')
        .mockResolvedValue(todosCount);
      // When
      const responseWithParams = await todosService.findTodos(limit, skip);
      const responseWithoutParams = await todosService.findTodos();
      // Then
      expect(findTodosSpy).toBeCalledTimes(2);
      expect(getTodosCountSpy).toBeCalledTimes(2);
      expect(responseWithParams).toEqual({
        todos: fetchedTodos,
        count: todosCount,
      });
      expect(responseWithoutParams).toEqual({
        todos: fetchedTodos,
        count: todosCount,
      });
    });

    it('todos service should call findTodos repository method and return fethced todos from non-emopty external source when db is not initialized and is empty with limit', async () => {
      // Given
      jest.mock('../todos.service', () => {
        const originalModule = jest.requireActual('../todos.service');
        return {
          __esModule: true,
          ...originalModule,
          isDatabaseInited: false,
        };
      });
      const todosCount = 0;
      const getTodosCountSpy = jest
        .spyOn(todosRepository, 'getTodosCount')
        .mockResolvedValue(todosCount);
      const getExternalDataSpy = jest
        .spyOn(todosRepository, 'getExternalData')
        .mockResolvedValue([...fetchedTodos, ...fetchedTodos]);
      // When
      const responseWithParams = await todosService.findTodos(limit, skip);
      // Then
      expect(findTodosSpy).toBeCalledTimes(0);
      expect(getTodosCountSpy).toBeCalledTimes(2);
      expect(getExternalDataSpy).toBeCalledTimes(1);

      expect(responseWithParams).toEqual({
        todos: fetchedTodos,
        count: todosCount,
      });
    });

    it('todos service should call findTodos repository method and return fethced todos from non-empty external source when db is not initialized and is empty without limit', async () => {
      // Given
      jest.mock('../todos.service', () => {
        const originalModule = jest.requireActual('../todos.service');
        return {
          __esModule: true,
          ...originalModule,
          isDatabaseInited: false,
        };
      });
      const todosCount = 0;
      const getTodosCountSpy = jest
        .spyOn(todosRepository, 'getTodosCount')
        .mockResolvedValue(todosCount);
      const getExternalDataSpy = jest
        .spyOn(todosRepository, 'getExternalData')
        .mockResolvedValue([...fetchedTodos, ...fetchedTodos]);
      // When
      const responseWithoutParams = await todosService.findTodos();
      // Then
      expect(findTodosSpy).toBeCalledTimes(0);
      expect(getTodosCountSpy).toBeCalledTimes(2);
      expect(getExternalDataSpy).toBeCalledTimes(1);

      expect(responseWithoutParams).toEqual({
        todos: [...fetchedTodos, ...fetchedTodos],
        count: todosCount,
      });
    });

    it('todos service should call findTodos repository method and return fethced todos from empty external source when db is not initialized and is empty', async () => {
      // Given
      jest.mock('../todos.service', () => {
        const originalModule = jest.requireActual('../todos.service');
        return {
          __esModule: true,
          ...originalModule,
          isDatabaseInited: false,
        };
      });
      const todosCount = 0;
      const getTodosCountSpy = jest
        .spyOn(todosRepository, 'getTodosCount')
        .mockResolvedValue(todosCount);
      const getExternalDataSpy = jest
        .spyOn(todosRepository, 'getExternalData')
        .mockResolvedValue([]);
      // When
      const responseWithParams = await todosService.findTodos(limit, skip);
      const responseWithoutParams = await todosService.findTodos();
      // Then
      expect(findTodosSpy).toBeCalledTimes(0);
      expect(getTodosCountSpy).toBeCalledTimes(2);
      expect(getExternalDataSpy).toBeCalledTimes(2);

      expect(responseWithParams).toEqual({
        todos: [],
        count: 0,
      });
      expect(responseWithoutParams).toEqual({
        todos: [],
        count: 0,
      });
    });

    it('todos service should call findTodos and fire exception when findTodos methods failed', async () => {
      // Given
      jest
        .spyOn(todosRepository, 'findTodos')
        .mockRejectedValue(new Error('Internal Server Error'));
      // Then
      await expect(todosService.findTodos(limit, skip)).rejects.toEqual(
        new InternalServerErrorException(),
      );
      await expect(todosService.findTodos()).rejects.toEqual(
        new InternalServerErrorException(),
      );
    });

    it('todos service should call findTodos and fire exception when getTodosCount methods failed', async () => {
      // Given
      jest
        .spyOn(todosRepository, 'getTodosCount')
        .mockRejectedValue(new Error('Internal Server Error'));
      // Then
      await expect(todosService.findTodos(limit, skip)).rejects.toEqual(
        new InternalServerErrorException(),
      );
      await expect(todosService.findTodos()).rejects.toEqual(
        new InternalServerErrorException(),
      );
    });

    it('todos service should call findTodos and fire exception when getExternalData methods failed', async () => {
      // Given
      jest.mock('../todos.service', () => {
        const originalModule = jest.requireActual('../todos.service');
        return {
          __esModule: true,
          ...originalModule,
          isDatabaseInited: false,
        };
      });
      const todosCount = 0;
      jest
        .spyOn(todosRepository, 'getTodosCount')
        .mockResolvedValue(todosCount);
      jest
        .spyOn(todosRepository, 'getExternalData')
        .mockRejectedValue(new Error('Internal Server Error'));
      // Then
      await expect(todosService.findTodos(limit, skip)).rejects.toEqual(
        new InternalServerErrorException(),
      );
      await expect(todosService.findTodos()).rejects.toEqual(
        new InternalServerErrorException(),
      );
    });
  });

  describe('Delete todo method options', () => {
    it('todos service should call deleteTodo repository method and return nothing', async () => {
      // Given
      const deleteTodoSpy = jest
        .spyOn(todosRepository, 'deleteTodo')
        .mockResolvedValue(undefined);
      // When
      const response: void = await todosService.deleteTodo([1]);
      // Then
      expect(deleteTodoSpy).toBeCalledTimes(1);
      expect(response).toBeUndefined();
    });

    it('todos service should call deleteTodo and fire exception when method failed', async () => {
      // Given
      jest
        .spyOn(todosRepository, 'deleteTodo')
        .mockRejectedValue(new Error('Internal Server Error'));
      // Then
      await expect(todosService.deleteTodo([1])).rejects.toEqual(
        new InternalServerErrorException(),
      );
    });
  });

  describe('Complete todo method options', () => {
    it('todos service should call completeTodo repository method and return nothing', async () => {
      // Given
      const completeTodoSpy = jest
        .spyOn(todosRepository, 'completeTodo')
        .mockResolvedValue(undefined);
      // When
      const response: void = await todosService.completeTodo(1);
      // Then
      expect(completeTodoSpy).toBeCalledTimes(1);
      expect(response).toBeUndefined();
    });

    it('todos service should call completeTodo and fire exception when method failed', async () => {
      // Given
      jest
        .spyOn(todosRepository, 'completeTodo')
        .mockRejectedValue(new Error('Internal Server Error'));
      // Then
      await expect(todosService.completeTodo(1)).rejects.toEqual(
        new InternalServerErrorException(),
      );
    });
  });

  describe('Change todo method options', () => {
    it('todos service should call changeTodo repository method and return nothing', async () => {
      // Given
      const changeTodoSpy = jest
        .spyOn(todosRepository, 'changeTodo')
        .mockResolvedValue(undefined);
      // When
      const response: void = await todosService.changeTodo(1, 'mock');
      // Then
      expect(changeTodoSpy).toBeCalledTimes(1);
      expect(response).toBeUndefined();
    });

    it('todos service should call changeTodo and fire exception when method failed', async () => {
      // Given
      jest
        .spyOn(todosRepository, 'changeTodo')
        .mockRejectedValue(new Error('Internal Server Error'));
      // Then
      await expect(todosService.changeTodo(1, 'mock')).rejects.toEqual(
        new InternalServerErrorException(),
      );
    });
  });

  describe('GetTodoCursor todo method options', () => {
    it('todos service should call getTodoCursor repository method and return cursor number when db is not empty', async () => {
      const cursor = 1;
      const todoMock = [
        { completed: false, title: 'title', id: cursor, userId: 1 },
      ];
      // Given
      const getTodoCursorSpy = jest
        .spyOn(todosRepository, 'getTodoCursor')
        .mockResolvedValue(todoMock);
      // When
      const response = await todosService.getTodoCursor();
      // Then
      expect(getTodoCursorSpy).toBeCalledTimes(1);
      expect(response).toBe(cursor);
    });

    it('todos service should call getTodoCursor repository method and return zero number when db is empty', async () => {
      const todoMock = [];
      // Given
      const getTodoCursorSpy = jest
        .spyOn(todosRepository, 'getTodoCursor')
        .mockResolvedValue(todoMock);
      // When
      const response = await todosService.getTodoCursor();
      // Then
      expect(getTodoCursorSpy).toBeCalledTimes(1);
      expect(response).toBe(0);
    });

    it('todos service should call getTodoCursor and fire exception when method failed', async () => {
      // Given
      jest
        .spyOn(todosRepository, 'getTodoCursor')
        .mockRejectedValue(new Error('Internal Server Error'));
      // Then
      await expect(todosService.getTodoCursor()).rejects.toEqual(
        new InternalServerErrorException(),
      );
    });
  });
});
