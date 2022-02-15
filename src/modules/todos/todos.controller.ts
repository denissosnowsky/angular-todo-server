import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

import { TodoDAO } from 'src/types/dao/create-todo.dao';
import { ImportantEnum } from 'src/types/types';
import { Todo } from './schemas/todo.schema';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createTodo(@Body() newTodo: TodoDAO, @Request() req): Promise<Todo> {
    return this.todosService.createTodo(newTodo);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  completeTodo(@Param('id') todoId: string, @Request() req): Promise<void> {
    return this.todosService.completeTodo(req.user.id, todoId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/change')
  changeTodo(
    @Param('id') todoId: string,
    @Body() body: { text: string; priority: ImportantEnum },
    @Request() req,
  ): Promise<void> {
    return this.todosService.changeTodo(
      req.user.id,
      todoId,
      body.text,
      body.priority,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete')
  deleteTodo(@Query('id') ids: Array<number>, @Request() req): Promise<void> {
    return this.todosService.deleteTodo(req.user.id, ids);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findTodos(
    @Request() req,
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
    @Query('complete') complete?: string,
    @Query('important') important?: string,
  ): Promise<{
    todos: Todo[];
    count: number;
  }> {
    return this.todosService.findTodos(
      req.user.id,
      limit ?? Number(limit),
      skip ?? Number(skip),
      complete,
      important,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/cursor')
  getTodoCursor(@Request() req): Promise<number> {
    return this.todosService.getTodoCursor(req.user.id);
  }
}
