import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../src/app.module';
import { TodosRepository } from '../src/modules/todos/todos.repository';

describe('Todos e2e tests', () => {
  let app: INestApplication;

  const initializeApp = async (todosRepository: TodosRepository) => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TodosRepository)
      .useValue(todosRepository)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  };

  afterAll(async () => {
    await app.close();
  });

  it(`/GET '/todos/cursor' should return todo cursor when todos list in database is not empty`, async () => {
    // Given
    const id = 28;
    const todosRepository = { getTodoCursor: () => [{ id }] };
    // When
    await initializeApp(todosRepository as unknown as TodosRepository);
    const repsonse = await request(app.getHttpServer()).get('/todos/cursor');
    // Then
    expect(repsonse.status).toEqual(200);
    expect(repsonse.text).toBe(String(id));
  });

  it(`/GET '/todos/cursor' should return zero when todos list in database is empty`, async () => {
    // Given
    const todosRepository = { getTodoCursor: () => [] };
    // When
    await initializeApp(todosRepository as unknown as TodosRepository);
    const repsonse = await request(app.getHttpServer()).get('/todos/cursor');
    // Then
    expect(repsonse.status).toEqual(200);
    expect(repsonse.text).toBe(String(0));
  });

  it(`/GET '/todos' should return todos list from database`, async () => {
    // Given
    const count = 100;
    const todos = [
      {
        id: 1,
        userId: 1,
        title: 'todo',
        completed: false,
      },
    ];
    const todosRepository = {
      getTodosCount: () => count,
      findTodos: () => todos,
    };
    // When
    await initializeApp(todosRepository as unknown as TodosRepository);
    const repsonse = await request(app.getHttpServer()).get('/todos');
    // Then
    expect(repsonse.status).toEqual(200);
    expect(repsonse.body).toEqual({
      todos,
      count,
    });
  });

  it(`/DELETE '/todos/delete' should return nothing`, async () => {
    // Given
    const todosRepository = {
      deleteTodo: () => undefined,
    };
    // When
    await initializeApp(todosRepository as unknown as TodosRepository);
    const repsonse = await request(app.getHttpServer())
      .delete('/todos/delete')
      .query({ id: 1 });
    // Then
    expect(repsonse.status).toEqual(200);
    expect(repsonse.body).toEqual({});
  });

  it(`/POST '/todos' should return created todo`, async () => {
    // Given
    const requestBody = {
      id: 1,
      userId: 1,
      title: 'todo',
    };
    const createdTodo = {
      id: 1,
      userId: 1,
      title: 'todo',
      completed: false,
    };
    const todosRepository = {
      createTodo: () => createdTodo,
    };
    // When
    await initializeApp(todosRepository as unknown as TodosRepository);
    const repsonse = await request(app.getHttpServer())
      .post('/todos')
      .send(requestBody);
    // Then
    expect(repsonse.status).toEqual(201);
    expect(repsonse.body).toEqual(createdTodo);
  });

  it(`/PUT '/todos/:id' should return nothing`, async () => {
    // Given
    const todosRepository = {
      completeTodo: () => undefined,
    };
    // When
    await initializeApp(todosRepository as unknown as TodosRepository);
    const repsonse = await request(app.getHttpServer()).put('/todos/1');
    // Then
    expect(repsonse.status).toEqual(200);
    expect(repsonse.body).toEqual({});
  });

  it(`/PUT '/todos/:id/change' should return nothing`, async () => {
    // Given
    const todosRepository = {
      changeTodo: () => undefined,
    };
    // When
    await initializeApp(todosRepository as unknown as TodosRepository);
    const repsonse = await request(app.getHttpServer())
      .put('/todos/1/change')
      .send({ text: 'newTitle' });
    // Then
    expect(repsonse.status).toEqual(200);
    expect(repsonse.body).toEqual({});
  });
});
