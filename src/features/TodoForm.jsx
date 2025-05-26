import {useState, useRef, useEffect} from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styled from "styled-components";

/* styled */
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledSearchGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  background-color: antiquewhite;
  color: blue;
  border: 1px solid #333;

  &:disabled {
    background-color: dimgray;
    font-style: italic;
  }
`;

const StyledInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
/* styled end */


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
        <StyledForm onSubmit={handleAddTodo}>
            
            <StyledSearchGroup>
                <label htmlFor="searchTodos">Search todos:&nbsp;</label>
                <StyledInput
                    id="searchTodos"
                    type="text"
                    value={localQueryString}
                    onChange={(e) => setLocalQueryString(e.target.value)}
                />
                &nbsp;
                <StyledButton type="button" onClick={() => setLocalQueryString("")}>
                    Clear
                </StyledButton>
            </StyledSearchGroup>
            
            <TextInputWithLabel
                elementId="todoTitle"
                label="Todo"
                ref={todoTitleInput}
                value={workingTodo}
                onChange={(event) => setWorkingTodo(event.target.value)}
            />
            <StyledButton type="submit"
                    disabled={workingTodo.trim() === "" || isSaving}
                >
                    {isSaving ? "Saving..." : "Add Todo"}
            </StyledButton>
        </StyledForm>
    );
}

export default TodoForm;
