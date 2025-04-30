import {useState, useRef} from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({onAddTodo}) {
    const [workingTodo, setWorkingTodo] = useState("");
    const todoTitleInput = useRef(null);

    function handleAddTodo(event) {
        event.preventDefault();
        onAddTodo(workingTodo);
        setWorkingTodo("");
        todoTitleInput.current.focus();

    }

    return (
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel
                elementId="todoTitle"
                label="Todo"
                ref={todoTitleInput}
                value={workingTodo}
                onChange={(event) => setWorkingTodo(event.target.value)}
            />
            <button type="submit"
                    disabled={workingTodo.trim() === "" || isSaving}
                >
                    {isSaving ? "Saving..." : "Add Todo"}
            </button>
        </form>
    );
}

export default TodoForm;
