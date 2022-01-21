import { Test, TestingModule } from '@nestjs/testing';

import { Todo } from '../schemas/todo.schema';
import { TodosController } from '../todos.controller';
import { TodosRepository } from '../todos.repository';
import { TodosService } from '../todos.service';

describe('Todos controller', () => {
  let todosController: TodosController;
  let todosService: TodosService;

  const todosRepositoryMock = {};

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        TodosService,
        { provide: TodosRepository, useValue: todosRepositoryMock },
      ],
    }).compile();

    todosController = app.get<TodosController>(TodosController);
    todosService = app.get<TodosService>(TodosService);
  });

  it('createTodo endpoint should return new todo', async () => {
    const body = {
      userId: 1,
      id: 1,
      title: 'mock',
    };
    const newTodo = {
      userId: body.userId,
      id: body.id,
      title: body.title,
      completed: false,
    };
    // Given
    const createTodoSpy = jest
      .spyOn(todosService, 'createTodo')
      .mockResolvedValue(newTodo);
    // When
    const response: Todo = await todosController.createTodo(body);
    // Then
    expect(createTodoSpy).toBeCalledTimes(1);
    expect(response).toEqual(newTodo);
  });

  it('completeTodo endpoint should return nothing', async () => {
    // Given
    const completeTodoSpy = jest
      .spyOn(todosService, 'completeTodo')
      .mockResolvedValue(undefined);
    // When
    const response = await todosController.completeTodo(1);
    // Then
    expect(completeTodoSpy).toBeCalledTimes(1);
    expect(response).toBeUndefined();
  });

  it('changeTodo endpoint should return nothing', async () => {
    // Given
    const changeTodoSpy = jest
      .spyOn(todosService, 'changeTodo')
      .mockResolvedValue(undefined);
    // When
    const response = await todosController.changeTodo(1, { text: 'title' });
    // Then
    expect(changeTodoSpy).toBeCalledTimes(1);
    expect(response).toBeUndefined();
  });

  it('deleteTodo endpoint should return nothing', async () => {
    // Given
    const deleteTodoSpy = jest
      .spyOn(todosService, 'deleteTodo')
      .mockResolvedValue(undefined);
    // When
    const response = await todosController.deleteTodo([1, 2]);
    // Then
    expect(deleteTodoSpy).toBeCalledTimes(1);
    expect(response).toBeUndefined();
  });

  it('findTodos endpoint should return fetched todos with count', async () => {
    // Given
    const limit = 1;
    const skip = 0;
    const fetchedData = { todos: [], count: 0 };
    const findTodosSpy = jest
      .spyOn(todosService, 'findTodos')
      .mockResolvedValue(fetchedData);
    // When
    const responseWithParams = await todosController.findTodos(limit, skip);
    const responseWithoutParams = await todosController.findTodos();
    // Then
    expect(findTodosSpy).toBeCalledTimes(2);
    expect(responseWithParams).toEqual(fetchedData);
    expect(responseWithoutParams).toEqual(fetchedData);
  });

  it('getTodoCursor endpoint should return cursor', async () => {
    // Given
    const cursor = 1;
    const getTodoCursorSpy = jest
      .spyOn(todosService, 'getTodoCursor')
      .mockResolvedValue(cursor);
    // When
    const responseWithParams = await todosController.getTodoCursor();
    // Then
    expect(getTodoCursorSpy).toBeCalledTimes(1);
    expect(responseWithParams).toBe(cursor);
  });
});
