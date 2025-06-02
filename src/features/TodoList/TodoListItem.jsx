
import { useState, useEffect } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import styles from './TodoListItem.module.css';


function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);

    useEffect(() => {
        setWorkingTitle(todo.title);
      }, [todo]);

    //cancel
    function handleCancel() {
        setWorkingTitle(todo.title);
        setIsEditing(false);
    }

    //edit
    function handleEdit(event) {
        setWorkingTitle(event.target.value);
    }

    //update
    function handleUpdate(event) {
        event.preventDefault();
        if (!isEditing || workingTitle === todo.title) return;

        onUpdateTodo({ ...todo, title: workingTitle });
        setIsEditing(false);
    }

return (
    <li className={styles.item}>
        <form onSubmit={handleUpdate}>
            {isEditing ? (
                <>
                    <TextInputWithLabel
                        elementId={`edit-${todo.id}`}
                        label="Edit Todo"
                        value={workingTitle}
                        onChange={handleEdit}
                />
                    <button type="button" onClick={handleCancel}>Cancel</button>
                    <button type="submit">Update</button>
                </>
        ) : (
                <>
                    <label>
                        <input
                            type="checkbox"
                            id={`checkbox${todo.id}`}
                            checked={todo.isCompleted}
                            onChange={() => onCompleteTodo(todo.id)}
                        />
                    </label>
                    <span onClick={() => setIsEditing(true)}>{todo.title}</span>
                </>
            )}
        </form>
    </li>
);
}

export default TodoListItem;
