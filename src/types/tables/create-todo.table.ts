import { ImportantEnum } from '../types';

export type TodoTable = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  important: ImportantEnum;
  _id: string;
};

export type ExternalTodoTable = Omit<TodoTable, '_id'>;
