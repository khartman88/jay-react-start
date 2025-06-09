
// src/pages/TodosPage.jsx //
import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList';

function TodosPage({
  todoState,
  handleAddTodo,
  updateTodo,
  completeTodo,
  queryString,
  setQueryString,
}) {
  return (
    <>
      <TodoForm
        onAddTodo={handleAddTodo}
        isSaving={todoState.isSaving}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      <TodoList
        todoList={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
      />
    </>
  );
}

export default TodosPage;
