import React, {
  createContext, useContext, useEffect, useReducer, useState,
} from 'react';
import styled from 'styled-components';
import localforage from 'localforage';
import filterReducer from './filterReducer';
import todoReducer from './todoReducer';

const DispatchContext = createContext(null);

const TodoItem = ({
  index, todo: { task, isCompleted },
}) => {
  const dispatch = useContext(DispatchContext);

  // since we get dispatch from Context, this components can now
  // dispatch the appropriate action itself and doesn't need to get
  // a function passed to it from above
  const changeComplete = () => {
    dispatch({
      type: isCompleted ? 'UNDO_TODO' : 'DO_TODO',
      index,
    });
  };

  const removeTodo = () => {
    dispatch({ type: 'REMOVE_TODO', index });
  };

  return (
    <StyledTodoItem style={{ textDecoration: isCompleted ? 'line-through' : '' }}>
      {task}
      <div>
        <Button
          type="button"
          onClick={changeComplete}
          style={{ marginRight: '4px' }}
        >
          {isCompleted ? 'Undo' : 'Complete'}
        </Button>
        <Button
          type="button"
          onClick={removeTodo}
        >
          X
        </Button>
      </div>
    </StyledTodoItem>
  );
};

// This is the input form at the bottom of the list for new todos
const TodoForm = () => {
  const [value, setValue] = useState('');
  const dispatch = useContext(DispatchContext);

  const addTodo = (event) => {
    event.preventDefault();
    if (!value) return;
    dispatch({ type: 'ADD_TODO', task: value });
    setValue('');
  };

  return (
    <form onSubmit={addTodo}>
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="add todo"
      />
    </form>
  );
};

const Filter = () => {
  // we useContext with our created Context which gives us
  // the global state i.e. the dispatch function.
  // this could just as well be an object
  const dispatch = useContext(DispatchContext);

  const handleShowAll = () => {
    dispatch({ type: 'SHOW_ALL' });
  };

  const handleShowComplete = () => {
    dispatch({ type: 'SHOW_COMPLETE' });
  };

  const handleShowIncomplete = () => {
    dispatch({ type: 'SHOW_INCOMPLETE' });
  };
  return (
    <HeadingWrapper>
      <Button type="button" onClick={handleShowAll}>
        Show All
      </Button>
      <Button type="button" onClick={handleShowComplete}>
        Show Complete
      </Button>
      <Button type="button" onClick={handleShowIncomplete}>
        Show Incomplete
      </Button>
    </HeadingWrapper>
  );
};

// This is the whole todo component that wraps the filters, list and input
const Todo = () => {
  const [todos, dispatchTodos] = useReducer(todoReducer, []);
  const [filter, dispatchFilters] = useReducer(filterReducer, 'ALL');

  // global dispatch function, this is like combineReducers in Redux
  const dispatch = (action) => [dispatchTodos, dispatchFilters].forEach((fn) => fn(action));

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'ALL') {
      return true;
    }
    if (filter === 'COMPLETE' && todo.isCompleted) {
      return true;
    }
    if (filter === 'INCOMPLETE' && !todo.isCompleted) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    localforage.getItem('todo-hooks')
      .then((val) => {
        if (typeof val === 'object' && val.length === 0) {
          dispatch({
            type: 'SET_TODOS',
            todos: [
              {
                task: 'Add some new tasks',
                isCompleted: false,
              },
            ],
          });
        } else if (val !== null) {
          dispatch({
            type: 'SET_TODOS',
            todos: val,
          });
        }
      })
      .catch(() => {
        dispatch({
          type: 'SET_TODOS',
          todos: [{
            task: 'Could not fetch todo items',
            isCompleted: false,
          }],
        });
      });
  }, []);
  return (
    // we provide our dispatch function to all components
    <DispatchContext.Provider value={dispatch}>
      <Wrapper>
        <ListWrapper>
          <Filter />
          {
          filteredTodos.map((todo, index) => (
            <TodoItem
              key={`${index.toString()}${todo.task}`}
              index={index}
              todo={todo}
            />
          ))
          }
          <TodoForm />
        </ListWrapper>
      </Wrapper>
    </DispatchContext.Provider>
  );
};

// Some styling

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #070231;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeadingWrapper = styled.div`
  padding: 5px 0;
  display: flex;
  justify-content: space-between;
`;

const ListWrapper = styled.div`
  margin-top: 2rem;
  background: #e8e8e8;
  border-radius: 4px;
  padding: 5px;
  min-width: 500px;
  color: black;
`;

const StyledTodoItem = styled.div`
  background: #fff;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.15);
  padding: 3px 10px;
  font-size: 16px;
  margin-bottom: 6px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Input = styled.input`
  width: 100%;
  font-size: 16px;
  box-sizing: border-box;
  border: 0;
  border-radius: 4px;
  box-shadow: none;
  padding: 1rem;
  height: 2.25em;
`;

const Button = styled.button`
  font-size: 14px;
  border-radius: 4px;

  &:hover {
    cursor: pointer;
  }

  &:active {
    background: #000;
    color: #fff;
  }
`;

export default Todo;
