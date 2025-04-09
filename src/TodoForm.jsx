import {useRef} from "react";

function TodoForm({onAddTodo}) {
    const todoTitleInput = useRef("");

    function handleAddTodo(event) {
        event.preventDefault();

    const title = event.target.title.value;
    onAddTodo({id: Date.now(), title});

    event.target.title.value = "";
    todoTitleInput.current.focus();

    }

    return (
        <form onSubmit={handleAddTodo}>
            <input type="text" name="title" ref={todoTitleInput}/>
            <button type="submit">Add Todo</button>
        </form>
    );
}

export default TodoForm;
