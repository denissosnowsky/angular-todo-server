import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TodoDTO } from 'src/types/dto/create-todo.dto';
import { Todo } from './schemas/todo.schema';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  createTodo(@Body() newTodo: TodoDTO): Promise<Todo> {
    return this.todosService.createTodo(newTodo);
  }

  @Put(':id')
  completeTodo(@Param('id') todoId: string): Promise<void> {
    return this.todosService.completeTodo(todoId);
  }

  @Delete(':id')
  deleteTodo(@Param('id') todoId: string): Promise<void> {
    return this.todosService.deleteTodo(todoId);
  }

  @Get()
  getAllTodos(): Promise<Todo[]> {
    return this.todosService.findAllTodos();
  }
}
