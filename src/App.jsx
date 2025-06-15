
import { Routes, Route } from 'react-router-dom';
import TodosPage from './pages/TodosPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

import {
  reducer as todosReducer,
  initialState as initialTodosState,
  actions as todoActions,
} from './reducers/todos.reducer';

import { useEffect, useState, useCallback, useReducer } from "react";
import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import styles from './App.module.css';
import Header from './shared/Header';
import { useLocation } from 'react-router-dom';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const location = useLocation();
  const [title, setTitle] = useState('');

    useEffect(() => {
      if (location.pathname === '/') setTitle('Todo List');
      else if (location.pathname === '/about') setTitle('About');
      else setTitle('Not Found');
    }, [location]);

  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");

  const [queryString, setQueryString] = useState("");

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = "";

    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}", title)`;
    }

    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);


  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.LOADING_STARTED });

      const options = {
        method: "GET",
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) {
          throw new Error(resp.statusText || "Failed to fetch todos");
        }

        const {records} = await resp.json();

        const fetchTodos = records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };

          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }

          return todo;
        });

        dispatch({ type: todoActions.SET_TODOS, payload: fetchTodos });

      } catch (error) {
        dispatch({ type: todoActions.SET_ERROR, payload: error.message });
      } finally {
        dispatch({ type: todoActions.LOADING_FINISHED });
      }
    };

    fetchTodos();
  }, [sortField, sortDirection, queryString, encodeUrl]);

  async function handleAddTodo(newTodoTitle) {
    dispatch({ type: todoActions.SAVING_STARTED });

    const newTodo = {
      title: newTodoTitle,
      isCompleted: false,
    };

    const payload = {
      fields: {
        title: newTodo.title,
        isCompleted: newTodo.isCompleted,
      },
    };

    // DEEEEBUUUUUUUGGGGGGGGGG
    console.log("Payload to send:", JSON.stringify(payload));

    const options = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.statusText || "Failed to add todo");
      }

      const record = await resp.json();

      // DEBBBBBUGGGGGGG
      console.log("Airtable response:", record);

      const savedTodo = {
        id: record.id,
        ...record.fields,
      };

      if (!record.fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      dispatch({ type: todoActions.ADD_TODO, payload: savedTodo });

    } catch (error) {
      dispatch({ type: todoActions.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: todoActions.SAVING_FINISHED });
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id);
    const updatedTodos = todoState.todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo
    );
    dispatch({ type: todoActions.SET_TODOS, payload: updatedTodos });

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.statusText || "Failed to update todo");
      }

      const { records } = await resp.json();
      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      const finalTodos = updatedTodos.map((todo) =>
        todo.id === updatedTodo.id ? { ...updatedTodo } : todo
      );
      dispatch({ type: todoActions.SET_TODOS, payload: finalTodos });

    } catch (error) {
      dispatch({ type: todoActions.SET_ERROR, payload: `${error.message}. Reverting todo...` });

      const revertedTodos = todoState.todoList.map((todo) =>
        todo.id === originalTodo.id ? originalTodo : todo
      );
      dispatch({ type: todoActions.SET_TODOS, payload: revertedTodos });
    } finally {
      dispatch({ type: todoActions.SAVING_FINISHED });
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoState.todoList.find((todo) => todo.id === id);
    const updatedTodo = { ...originalTodo, isCompleted: true };

    const optimisticTodos = todoState.todoList.map((todo) =>
      todo.id === id ? updatedTodo : todo
    );
    dispatch({ type: todoActions.SET_TODOS, payload: optimisticTodos });

    const payload = {
      records: [
        {
          id,
          fields: {
            title: updatedTodo.title,
            isCompleted: true,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.statusText || "Failed to complete todo");
      }

      const { records } = await resp.json();
      const completedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      const finalTodos = todoState.todoList.map((todo) =>
        todo.id === id ? completedTodo : todo
      );
      dispatch({ type: todoActions.SET_TODOS, payload: finalTodos });

    } catch (error) {
      dispatch({ type: todoActions.SET_ERROR, payload: `${error.message}. Reverting todo...` });

      const revertedTodos = todoState.todoList.map((todo) =>
        todo.id === originalTodo.id ? originalTodo : todo
      );
      dispatch({ type: todoActions.SET_TODOS, payload: revertedTodos });
    }
  }

  return (
    <div className={styles.appContainer}>
      <Header title={title} />

      <div>
        <label>
          Sort by:&nbsp;
          <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="createdTime">Created Time</option>
            <option value="title">Title</option>
            <option value="isCompleted">Completed</option>
          </select>
        </label>
        &nbsp;&nbsp;
        <label>
          Direction:&nbsp;
          <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
        <Routes>
          <Route
            path="/"
            element={
              <TodosPage
                todoState={todoState}
                handleAddTodo={handleAddTodo}
                updateTodo={updateTodo}
                completeTodo={completeTodo}
                queryString={queryString}
                setQueryString={setQueryString}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      {todoState.errorMessage && (
        <div className={styles.errorBox}>
          <hr />
          <p>{todoState.errorMessage}</p>
          <button onClick={() => dispatch({ type: todoActions.CLEAR_ERROR })}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;
