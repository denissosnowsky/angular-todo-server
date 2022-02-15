import { ImportantEnum } from '../types';

export type TodoDTO = {
  userId: string;
  id: number;
  title: string;
  completed: boolean;
  important: ImportantEnum;
};
