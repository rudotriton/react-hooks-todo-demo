const todoReducer = (state, action) => {
  switch (action.type) {
    case 'DO_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return { ...todo, isCompleted: true };
        }
        return todo;
      });
    case 'UNDO_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return { ...todo, isCompleted: false };
        }
        return todo;
      });
    case 'ADD_TODO':
      return state.concat({
        task: action.task,
        isCompleted: false,
      });
    case 'REMOVE_TODO':
      return state.slice(0, action.index).concat(state.slice(action.index + 1));
    default:
      return state;
  }
};

export default todoReducer;
