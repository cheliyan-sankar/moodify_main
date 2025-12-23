"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

export default function TodoList() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<{ id: string; text: string; done: boolean }[]>([]);
  const [newTodo, setNewTodo] = useState('');

  // load todos for this user from localStorage
  useEffect(() => {
    if (!user) {
      setTodos([]);
      return;
    }
    try {
      const key = `todos_${user.id}`;
      const raw = localStorage.getItem(key);
      if (raw) setTodos(JSON.parse(raw));
    } catch (e) {
      console.error('Error loading todos:', e);
    }
  }, [user]);

  // persist todos
  useEffect(() => {
    if (!user) return;
    try {
      const key = `todos_${user.id}`;
      localStorage.setItem(key, JSON.stringify(todos));
    } catch (e) {
      console.error('Error saving todos:', e);
    }
  }, [todos, user]);

  const addTodo = () => {
    const text = newTodo.trim();
    if (!text || !user) return;
    setTodos(prev => [{ id: `${Date.now()}`, text, done: false }, ...prev]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const removeTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addTodo(); }}
          placeholder="Add a quick task (e.g., Play a 5-min breathing game)"
          className="flex-1 px-3 py-2 rounded border bg-white text-primary"
        />
        <Button onClick={addTodo} className="whitespace-nowrap">Add</Button>
      </div>

      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-sm text-muted-foreground">No todos yet. Add one to stay focused.</p>
        ) : (
          todos.map(t => (
            <div key={t.id} className="flex items-center justify-between p-2 bg-secondary/20 rounded">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id)} />
                <span className={`${t.done ? 'line-through text-muted-foreground' : 'text-primary'}`}>{t.text}</span>
              </div>
              <Button variant="ghost" onClick={() => removeTodo(t.id)}>Remove</Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
