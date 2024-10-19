"use client";

import { useEffect, useState } from 'react';
import TaskList from "./components/TaskList";

const initialTasks = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    priority: 'High',
    completed: false
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 2',
    priority: 'Medium',
    completed: false
  },
  {
    id: 3,
    title: 'Task 3',
    description: 'Description 3',
    priority: 'Low',
    completed: false
  },
];

const HomePage = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'High' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.title || !newTask.description) return;
    const taskToAdd = {
      id: Date.now(),
      ...newTask,
      completed: false,
    };
    setTasks((prevTasks) => [...prevTasks, taskToAdd]);
    setNewTask({ title: '', description: '', priority: 'High' });
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (id, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const filteredTasks = tasks
    .filter((task) =>
      !task.completed && (task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return (priorityOrder[a.priority] - priorityOrder[b.priority]) || (Number(a.completed) - Number(b.completed));
    });

  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="task-container">
      <div>
        <h1>Task Management App</h1>
        <div className='task-heading'>
          <h2>My Tasks</h2>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <TaskList
          tasks={filteredTasks}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
          editTask={editTask}
        />
        <div className="new-task">
          <h2>Add New Task</h2>
          <div className='new-task-container'>
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button onClick={addTask}>Add Task</button>
          </div>
        </div>

        {completedTasks.length > 0 && (
          <div>
            <h2>Completed Tasks</h2>
            <TaskList
              tasks={completedTasks}
              deleteTask={deleteTask}
              toggleComplete={toggleComplete}
              editTask={editTask}
              showEditButton={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;