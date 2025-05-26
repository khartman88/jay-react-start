import {useState, useRef, useEffect} from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({onAddTodo, isSaving, queryString, setQueryString}) {
    const [workingTodo, setWorkingTodo] = useState("");
    const todoTitleInput = useRef(null);

    const [localQueryString, setLocalQueryString] = useState(queryString);

    function handleAddTodo(event) {
        event.preventDefault();
        if (workingTodo.trim()) {
            onAddTodo(workingTodo);
            setWorkingTodo("");
            todoTitleInput.current.focus();
          }
        }

     useEffect(() => {
        const debounce = setTimeout(() => {
            setQueryString(localQueryString);
        }, 500);

        return () => clearTimeout(debounce);
    }, [localQueryString, setQueryString]);

    return (
        <form onSubmit={handleAddTodo}>
            
            <div>
                <label htmlFor="searchTodos">Search todos:&nbsp;</label>
                <input
                    id="searchTodos"
                    type="text"
                    value={localQueryString}
                    onChange={(e) => setLocalQueryString(e.target.value)}
                />
                &nbsp;
                <button type="button" onClick={() => setLocalQueryString("")}>
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
