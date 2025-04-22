
import { useState } from "react";
import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

function App() {

  const [todoList, setTodoList] = useState([]);

  function handleAddTodo(newTodoTitle) {

    const newTodo = {
      title: newTodoTitle,
      id: crypto.randomUUID(),
      isCompleted: false,
    };

    setTodoList([...todoList, newTodo]);
  }

  function completeTodo(id) {

    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
        });
      
    setTodoList(updatedTodos);
  }

  return (
    
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo}/>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
    
  );
}

export default App;
