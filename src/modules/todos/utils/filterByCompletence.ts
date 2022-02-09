import { ExternalTodoTable } from 'src/types/tables/create-todo.table';

export const filterByCompletence = (
  complete: string,
  todos: ExternalTodoTable[],
) => {
  switch (complete) {
    case 'complete':
      todos.filter((item) => item.completed);
      break;
    case 'uncomplete':
      todos.filter((item) => !item.completed);
      break;
  }
};
