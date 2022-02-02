import { ImportantEnum } from '../types';

export type TodoDTO = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  important: ImportantEnum;
};
