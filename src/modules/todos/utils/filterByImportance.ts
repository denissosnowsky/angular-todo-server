import { ExternalTodoTable } from 'src/types/tables/create-todo.table';

export const filterByImportance = (
  important: string,
  todos: ExternalTodoTable[],
) => {
  switch (important) {
    case 'high':
      todos.filter((item) => item.important === 'high');
      break;
    case 'low':
      todos.filter((item) => item.important === 'low');
      break;
    case 'normal':
      todos.filter((item) => item.important === 'normal');
      break;
    case 'none':
      todos.filter((item) => item.important === '');
      break;
  }
};
