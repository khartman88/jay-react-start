
import { useEffect, useState } from "react";
import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

const encodeUrl = ({ sortField, sortDirection, queryString }) => {
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  let searchQuery = "";

  if (queryString) {
    searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
  }

  return encodeURI(`${url}?${sortQuery}${searchQuery}`);
};

function App() {

  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");

  const [queryString, setQueryString] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
        method: "GET",
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(encodeUrl({ sortField, sortDirection, queryString }), options);
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

        setTodoList(fetchTodos);

      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [sortField, sortDirection, queryString]);

  async function handleAddTodo(newTodoTitle) {
    setIsSaving(true);

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
      const resp = await fetch(encodeUrl({ sortField, sortDirection, queryString }), options);
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

      setTodoList([...todoList, savedTodo]);

    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);

    } finally {
      setIsSaving(false);
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    const updatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo
    );
    setTodoList(updatedTodos);

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
      const resp = await fetch(encodeUrl({ sortField, sortDirection, queryString }), options);
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
      setTodoList(finalTodos);

    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      const revertedTodos = todoList.map((todo) =>
        todo.id === originalTodo.id ? originalTodo : todo
      );
      setTodoList(revertedTodos);
    } finally {
      setIsSaving(false);
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);
    const updatedTodo = { ...originalTodo, isCompleted: true };

    const optimisticTodos = todoList.map((todo) =>
      todo.id === id ? updatedTodo : todo
    );
    setTodoList(optimisticTodos);

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
      const resp = await fetch(encodeUrl({ sortField, sortDirection, queryString }), options);
      if (!resp.ok) {
        throw new Error(resp.statusText || "Failed to complete todo");
      }

      const { records } = await resp.json();
      const completedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      const finalTodos = todoList.map((todo) =>
        todo.id === id ? completedTodo : todo
      );
      setTodoList(finalTodos);

    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      const revertedTodos = todoList.map((todo) =>
        todo.id === originalTodo.id ? originalTodo : todo
      );
      setTodoList(revertedTodos);
    }
  }

  return (
    <div>
      <h1>My Todos</h1>

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

      <TodoForm
        onAddTodo={handleAddTodo}
        isSaving={isSaving}
        queryString={queryString}
        setQueryString={setQueryString}  
      />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;