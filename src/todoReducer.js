import localforage from 'localforage';

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'DO_TODO': {
      const newState = state.map((todo, index) => {
        if (index === action.index) {
          return { ...todo, isCompleted: true };
        }
        return todo;
      });
      localforage.setItem('todo-hooks', newState);
      return newState;
    }
    case 'UNDO_TODO': {
      const newState = state.map((todo, index) => {
        if (index === action.index) {
          return { ...todo, isCompleted: false };
        }
        return todo;
      });
      localforage.setItem('todo-hooks', newState);
      return newState;
    }
    case 'ADD_TODO': {
      const newState = state.concat({
        task: action.task,
        isCompleted: false,
      });
      localforage.setItem('todo-hooks', newState);
      return newState;
    }
    case 'REMOVE_TODO': {
      const newState = state.slice(0, action.index).concat(state.slice(action.index + 1));
      localforage.setItem('todo-hooks', newState);
      return newState;
    }
    case 'SET_TODOS':
      return action.todos;
    default:
      return state;
  }
};

export default todoReducer;
