import React, { useState } from 'react';
import styled from 'styled-components';

const TodoItem = ({
  index, completeTodo, removeTodo, todo: { text, isCompleted },
}) => (
  <StyledTodoItem style={{ textDecoration: isCompleted ? 'line-through' : '' }}>
    {text}
    <div>
      <button type="button" onClick={() => completeTodo(index)}>Complete</button>
      <button type="button" onClick={() => removeTodo(index)}>X</button>
    </div>
  </StyledTodoItem>
);

const TodoForm = ({ addTodo }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="add todo"
      />
    </form>
  );
};

const Todo = () => {
  const [todos, setTodos] = useState([
    {
      text: 'learn about hooks',
      isCompleted: false,
    },
    {
      text: 'design ui for app',
      isCompleted: false,
    },
    {
      text: 'write a song',
      isCompleted: false,
    },
  ]);

  const addTodo = (text) => {
    const newTodos = [...todos, { text }];
    setTodos(newTodos);
  };

  const completeTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].isCompleted = true;
    setTodos(newTodos);
  };
  const removeTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };
  return (

    <Wrapper>
      <ListWrapper>
        {
        todos.map((todo, index) => (
          <TodoItem
            completeTodo={completeTodo}
            removeTodo={removeTodo}
            key={`${index.toString()}${todo.text}`}
            index={index}
            todo={todo}
          />
        ))
        }
        <TodoForm addTodo={addTodo} />
      </ListWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #209cee;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ListWrapper = styled.div`
  margin-top: 2rem;
  background: #e8e8e8;
  border-radius: 4px;
  padding: 5px;
  min-width: 400px;
  color: black;
`;

const StyledTodoItem = styled.div`
  background: #fff;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.15);
  padding: 3px 10px;
  font-size: 12px;
  margin-bottom: 6px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 0;
  border-radius: 4px;
  box-shadow: none;
  padding: 1rem;
  height: 2.25em;
`;

export default Todo;
