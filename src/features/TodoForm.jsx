import {useState, useRef} from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({onAddTodo, isSaving, queryString, setQueryString}) {
    const [workingTodo, setWorkingTodo] = useState("");
    const todoTitleInput = useRef(null);

    function handleAddTodo(event) {
        event.preventDefault();
        if (workingTodo.trim()) {
            onAddTodo(workingTodo);
            setWorkingTodo("");
            todoTitleInput.current.focus();
          }
        }

    return (
        <form onSubmit={handleAddTodo}>
            
            <div>
                <label htmlFor="searchTodos">Search todos:&nbsp;</label>
                <input
                    id="searchTodos"
                    type="text"
                    value={queryString}
                    onChange={(e) => setQueryString(e.target.value)}
                />
                &nbsp;
                <button type="button" onClick={() => setQueryString("")}>
                    Clear
                </button>
            </div>
            
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
