import React, { useState, useEffect } from "react";
import { getAllTasks, createTask, updateTask, deleteTask } from "../../services/task/taskService"; // Importer le service API

const TodoList = ({ title = "ToDoList" }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Charger les tâches au montage du composant
  useEffect(() => {
    loadTasks();
  }, []); // L'effet ne dépend plus de la liste des tâches

  // Fonction pour charger les tâches depuis l'API
  const loadTasks = async () => {
    try {
      const response = await getAllTasks(); // Utilisation du service pour récupérer les tâches
      setTasks(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des tâches", error);
    }
  };

  // Fonction pour ajouter une nouvelle tâche
  const addTask = async () => {
    if (newTask.trim()) {
      const taskPayload = { text: newTask, completed: false, addByAdmin: false };

      try {
        const response = await createTask(taskPayload); // Utilisation du service pour créer une tâche
        if (response.data && response.data._id) {
          // Remplacer 'id' par '_id' car Mongoose génère '_id'
          setTasks([...tasks, response.data]); // Mise à jour de la liste des tâches
          setNewTask(""); // Réinitialiser le champ
        } else {
          console.error("Erreur : la tâche n’a pas d’ID");
        }
      } catch (error) {
        console.error("Erreur lors de la création de la tâche", error);
      }
    } else {
      console.log("Le champ de la nouvelle tâche est vide.");
    }
  };

  // Fonction pour inverser le statut d'une tâche
  const toggleTaskStatus = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed }; // Inverser l'état de la tâche
      await updateTask(task._id, updatedTask); // Utilisation du service pour mettre à jour la tâche
      setTasks(tasks.map((t) => (t._id === task._id ? updatedTask : t))); // Mettre à jour l'état local
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche", error);
    }
  };

  // Fonction pour supprimer une tâche
  const removeTask = async (taskId, index) => {
    try {
      await deleteTask(taskId); // Utilisation du service pour supprimer la tâche
      setTasks(tasks.filter((_, i) => i !== index)); // Supprimer la tâche de l'état local
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche", error);
    }
  };

  return (
    <div className="todo-container">
      <h2>{title}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
      >
        <input
          type="text"
          placeholder="Ajouter une nouvelle tâche"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          required
          className="todo-input"
        />
        <button type="submit" className="add-button">
          Ajouter
        </button>
      </form>

      <ul className="todo-list">
        {tasks.map((task, index) => (
          <li key={task._id} className={task.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskStatus(task)}
            />
            {task.addByAdmin && (
              <img src="/assets/images/admin-icon.png" alt="admin icon" className="admin-icon" />
            )}
            <span>{task.text}</span>
            <button onClick={() => removeTask(task._id, index)} className="delete-button">
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;