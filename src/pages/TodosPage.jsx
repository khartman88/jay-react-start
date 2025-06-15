
// src/pages/TodosPage.jsx //
import { useSearchParams, useNavigate } from 'react-router-dom';
import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';

const TODOS_PER_PAGE = 5;

function TodosPage({
  todoState,
  handleAddTodo,
  updateTodo,
  completeTodo,
  queryString,
  setQueryString,
}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = parseInt(searchParams.get('page')) || 1;
  const totalTodos = todoState.todoList.length;
  const totalPages = Math.ceil(totalTodos / TODOS_PER_PAGE);

  const startIndex = (page - 1) * TODOS_PER_PAGE;
  const endIndex = startIndex + TODOS_PER_PAGE;
  const currentTodos = todoState.todoList.slice(startIndex, endIndex);

  const goToPage = (newPage) => {
    navigate(`/?page=${newPage}`);
  };

  return (
    <>
      <TodoForm
        onAddTodo={handleAddTodo}
        isSaving={todoState.isSaving}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      <TodoList
        todoList={currentTodos}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
        />

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => goToPage(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        &nbsp;
        <span>Page {page} of {totalPages}</span>
        &nbsp;
        <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </>
  );
}

export default TodosPage;
