export type TodoTable = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  _id: string;
};

export type ExternalTodoTable = Omit<TodoTable, '_id'>;
