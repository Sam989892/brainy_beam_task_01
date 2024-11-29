import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleComplete, removeTodo, editTodo } from './todoSlice';
import ThemeToggle from '../../components/ThemeToggle';
import '../../components/styles/Todo.css';

const MAX_CHARS = 70;

const TodoList = () => {
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Todo List App";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!input.trim() || input.length > MAX_CHARS) {
      e.target.classList.add('shake');
      setTimeout(() => {
        e.target.classList.remove('shake');
      }, 500);
      return;
    }

    if (editingId !== null) {
      dispatch(editTodo({
        id: editingId,
        newText: input.trim()
      }));
      setEditingId(null);
    } else {
      dispatch(addTodo({
        text: input.trim()
      }));
    }
    setInput('');
  };

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      dispatch(removeTodo(id));
      setRemovingId(null);
    }, 300);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= MAX_CHARS) {
      setInput(inputValue);
    } else {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000); // Alert will disappear after 2 seconds
    }
  };

  return (
    <div className="todo-container">
      {showAlert && (
        <div className="alert-message">
          Maximum 70 characters allowed!
        </div>
      )}
      <ThemeToggle />
      <div className="todo-header">
        <h1>✨ Todo List App</h1>
        <p>Organize your day, achieve your goals</p>
      </div>
      
      <form onSubmit={handleSubmit} className="todo-input-container">
        <div className="input-wrapper">
          <input
            type="text"
            className="todo-input"
            value={input}
            onChange={handleInputChange}
            placeholder="What's on your mind today?"
            maxLength={MAX_CHARS}
          />
        </div>
        <button type="submit" className="add-button">
          {editingId !== null ? '✓ Update' : '+ Add Task'}
        </button>
        {editingId !== null && (
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => {
              setEditingId(null);
              setInput('');
            }}
          >
            ✕ Cancel
          </button>
        )}
      </form>

      <div className="todo-list">
        {todos.length === 0 ? (
          <div className="empty-state">
            No tasks yet. Add one to get started!
          </div>
        ) : (
          todos.map(todo => (
            <div 
              key={todo.id} 
              className={`todo-item 
                ${editingId === todo.id ? 'editing' : ''} 
                ${todo.completed ? 'todo-item-complete' : ''}
                ${removingId === todo.id ? 'todo-item-exit' : ''}`}
            >
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.completed}
                onChange={() => dispatch(toggleComplete(todo.id))}
              />
              <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                {todo.text}
              </span>
              <div className="todo-actions">
                <button
                  className="todo-button edit-button"
                  onClick={() => {
                    setEditingId(todo.id);
                    setInput(todo.text);
                  }}
                  disabled={todo.completed}
                >
                  ✏️
                </button>
                <button
                  className="todo-button delete-button"
                  onClick={() => handleRemove(todo.id)}
                  disabled={removingId === todo.id}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList; 