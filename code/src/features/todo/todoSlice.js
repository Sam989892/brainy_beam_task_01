import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push({ 
        id: Date.now(), 
        text: action.payload.text,
        completed: false,
        priority: action.payload.priority || 'medium'
      });
    },
    toggleComplete: (state, action) => {
      const todo = state.find((todo) => todo.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    removeTodo: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload);
    },
    editTodo: (state, action) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.text = action.payload.newText;
        todo.priority = action.payload.priority;
      }
    },
    updatePriority: (state, action) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) todo.priority = action.payload.priority;
    },
    reorderTodos: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.splice(sourceIndex, 1);
      state.splice(destinationIndex, 0, removed);
    },
  },
});

export const { 
  addTodo, 
  toggleComplete, 
  removeTodo, 
  editTodo,
  updatePriority,
  reorderTodos 
} = todoSlice.actions;

export default todoSlice.reducer;
