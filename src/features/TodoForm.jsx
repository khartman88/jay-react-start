import {useState} from "react";

function TodoForm({onAddTodo}) {
    const [workingTodo, setWorkingTodo] = useState("");

    function handleAddTodo(event) {
        event.preventDefault();
        onAddTodo(workingTodo);
        setWorkingTodo("");

    }

    return (
        <form onSubmit={handleAddTodo}>
            <input
                type="text"
                name="title"
                value={workingTodo}
                onChange={(event) => setWorkingTodo(event.target.value)}
            />
            <button type="submit" disabled={workingTodo.trim() === ""}>
                Add Todo</button>
        </form>
    );
}

export default TodoForm;
