
// actions //
export const actions = {
  LOADING_STARTED: 'LOADING_STARTED',
  SET_TODOS: 'SET_TODOS',
  SET_ERROR: 'SET_ERROR',
  SAVING_STARTED: 'SAVING_STARTED',
  ADD_TODO: 'ADD_TODO',
  SAVING_FINISHED: 'SAVING_FINISHED',
  LOADING_FINISHED: 'LOADING_FINISHED',
  CLEAR_ERROR: 'CLEAR_ERROR',
};


// initial state //
export const initialState = {
    todoList: [],
    isLoading: false,
    isSaving: false,
    errorMessage: '',
};

// reducer function //
export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOADING_STARTED:
      return { ...state, isLoading: true };

    case actions.SET_TODOS:
      return {
        ...state,
        todoList: action.payload.map(todo => ({
          id: todo.id,
          title: todo.title,
          isCompleted: todo.isCompleted ?? false,
        })),
        isLoading: false,
      };

    case actions.SET_ERROR:
      return {
        ...state,
        errorMessage: action.payload,
        isLoading: false,
        isSaving: false,
      };

    case actions.SAVING_STARTED:
      return { ...state, isSaving: true };

    case actions.SAVING_FINISHED:
      return { ...state, isSaving: false };

    case actions.LOADING_FINISHED:
      return { ...state, isLoading: false };

    case actions.ADD_TODO:
      return {
        ...state,
        todoList: [...state.todoList, {
          id: action.payload.id,
          title: action.payload.title,
          isCompleted: action.payload.isCompleted ?? false,
        }],
        isSaving: false,
      };

    case actions.CLEAR_ERROR:
      return { ...state, errorMessage: '' };

    default:
      return state;
  }
}