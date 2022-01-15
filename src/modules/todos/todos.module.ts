import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TodosRepository } from './todos.repository';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    ConfigModule.forRoot(),
  ],
  controllers: [TodosController],
  providers: [TodosService, TodosRepository],
})
export class TodosModule {}
