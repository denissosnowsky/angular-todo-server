import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TodoDAO } from 'src/types/dao/create-todo.dao';
import { Todo } from './schemas/todo.schema';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  createTodo(@Body() newTodo: TodoDAO): Promise<Todo> {
    return this.todosService.createTodo(newTodo);
  }

  @Put(':id')
  completeTodo(@Param('id', ParseIntPipe) todoId: number): Promise<void> {
    return this.todosService.completeTodo(todoId);
  }

  @Put(':id/change')
  changeTodo(
    @Param('id', ParseIntPipe) todoId: number,
    @Body() body: { text: string },
  ): Promise<void> {
    return this.todosService.changeTodo(todoId, body.text);
  }

  @Delete('/delete')
  deleteTodo(@Query('id') ids: Array<number>): Promise<void> {
    return this.todosService.deleteTodo(ids);
  }

  @Get()
  findTodos(
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
  ): Promise<{
    todos: Todo[];
    count: number;
  }> {
    return this.todosService.findTodos(
      limit ?? Number(limit),
      skip ?? Number(skip),
    );
  }

  @Get('/cursor')
  getTodoCursor(): Promise<number> {
    return this.todosService.getTodoCursor();
  }
}
