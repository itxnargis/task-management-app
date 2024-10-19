import { useState } from 'react';

const TaskList = ({ tasks, deleteTask, toggleComplete, editTask, showEditButton = true }) => {
  const [editMode, setEditMode] = useState(null);
  const [originalTask, setOriginalTask] = useState({}); 

  const priorityClassMap = {
    High: 'priority-high',
    Medium: 'priority-medium',
    Low: 'priority-low',
  };

  const saveEdit = (taskId, updatedTask) => {
    editTask(taskId, updatedTask);
    setEditMode(null);
    setOriginalTask({}); 
  };

  const handleEditClick = (task) => {
    setEditMode(task.id);
    setOriginalTask({ title: task.title, description: task.description }); 
  };

  const handleCancelEdit = () => {
    setEditMode(null); 
  };

  return (
    <div className="tasklist-container">
      {tasks.map((task) => (
        <div
          className={`tasklist-description ${priorityClassMap[task.priority] || ''}`}
          key={task.id}
        >
          <div className="tasklist-info">
            <div className="tasklist-details">
              {editMode === task.id ? (
                <div className="tasklist-edit-container">
                  <input
                    type="text"
                    value={originalTask.title || task.title}
                    onChange={(e) => setOriginalTask({ ...originalTask, title: e.target.value })}
                  />
                  <input
                    type="text"
                    value={originalTask.description || task.description}
                    onChange={(e) => setOriginalTask({ ...originalTask, description: e.target.value })}
                  />
                  <select
                    value={task.priority}
                    onChange={(e) => editTask(task.id, { title: originalTask.title, description: originalTask.description, priority: e.target.value })}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <div className="tasklist-edit-buttons">
                    <button onClick={() => saveEdit(task.id, { title: originalTask.title, description: originalTask.description, priority: task.priority })}>
                      Save
                    </button>
                    <button onClick={() => toggleComplete(task.id)}>
                      {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
                    </button>
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                    <button onClick={handleCancelEdit}>Cancel</button> 
                  </div>
                </div>
              ) : (
                <>
                  <h2>{task.title}</h2>
                  <div className="tasklist-buttons">
                    {showEditButton && (
                      <>
                        <button onClick={() => handleEditClick(task)}>Edit</button>
                        <button onClick={() => toggleComplete(task.id)}>
                          {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
                        </button>
                      </>
                    )}
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
            {editMode === task.id ? null : <p>{task.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
