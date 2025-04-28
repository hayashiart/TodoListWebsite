// Importe React et les hooks nécessaires
// Syntaxe : import { useState, useEffect } from 'react' importe les hooks
import React, { FC, FormEvent, useState, useEffect } from 'react';

// Importe axios pour effectuer des requêtes HTTP
// Syntaxe : import axios from '../axios' importe l’instance configurée
// Rôle : Envoie des requêtes à /api/tasks avec token JWT
import axios from '../axios';

// Importe les styles CSS
// Syntaxe : import './TaskList.css' importe le fichier CSS
// Rôle : Applique les styles définis dans TaskList.css
import './TaskList.css';

// Interface pour une tâche
// Syntaxe : interface définit les types d’une tâche
// Rôle : Typage pour les données des tâches
interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// Interface pour l’état du composant
// Syntaxe : interface définit les types de l’état
// Rôle : Typage pour les champs du formulaire et les filtres
interface TaskListState {
  tasks: Task[];
  title: string;
  description: string;
  filter: 'all' | 'completed' | 'incomplete';
  sort: 'title-asc' | 'title-desc' | 'date-asc' | 'date-desc';
  searchQuery: string;
  error: string;
  editingTaskId: number | null;
  editingTitle: string;
  editingDescription: string;
}

// Définit le composant TaskList
// Syntaxe : FC définit un composant fonctionnel avec TypeScript
// Rôle : Affiche un formulaire et une liste de tâches
const TaskList: FC = () => {
  // Crée une variable d’état pour le composant
  // Syntaxe : useState initialise avec un objet typé
  // Rôle : Stocke les tâches, champs du formulaire, et filtres
  const [state, setState] = useState<TaskListState>({
    tasks: [],
    title: '',
    description: '',
    filter: 'all',
    sort: 'title-asc',
    searchQuery: '',
    error: '',
    editingTaskId: null,
    editingTitle: '',
    editingDescription: '',
  });

  // Charge les tâches au montage du composant
  // Syntaxe : useEffect exécute un effet
  // Rôle : Récupère les tâches depuis l’API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<Task[]>('/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setState((prev) => ({ ...prev, tasks: response.data }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error.response?.data.error || 'Failed to fetch tasks',
        }));
      }
    };
    fetchTasks();
  }, []);

  // Définit la fonction handleCreate pour créer une tâche
  // Arguments : event (événement de soumission)
  // Syntaxe : async pour utiliser await
  // Rôle : Envoie une nouvelle tâche à l’API
  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState((prev) => ({ ...prev, error: '' }));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post<{ task: Task }>(
        '/api/tasks',
        { title: state.title, description: state.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setState((prev) => ({
        ...prev,
        tasks: [...prev.tasks, response.data.task],
        title: '',
        description: '',
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.response?.data.error || 'Failed to create task',
      }));
    }
  };

  // Définit la fonction handleToggleComplete pour basculer le statut
  // Arguments : id (ID de la tâche), completed (nouveau statut)
  // Syntaxe : async pour utiliser await
  // Rôle : Met à jour le statut completed
  const handleToggleComplete = async (id: number, completed: boolean) => {
    setState((prev) => ({ ...prev, error: '' }));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put<{ task: Task }>(
        `/api/tasks/${id}`,
        { completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task.id === id ? response.data.task : task
        ),
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.response?.data.error || 'Failed to update task',
      }));
    }
  };

  // Définit la fonction handleDelete pour supprimer une tâche
  // Arguments : id (ID de la tâche)
  // Syntaxe : async pour utiliser await
  // Rôle : Supprime une tâche
  const handleDelete = async (id: number) => {
    setState((prev) => ({ ...prev, error: '' }));

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((task) => task.id !== id),
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.response?.data.error || 'Failed to delete task',
      }));
    }
  };

  // Définit la fonction handleEdit pour activer l’édition inline
  // Arguments : id, taskTitle, taskDescription (données de la tâche)
  // Syntaxe : fonction fléchée
  // Rôle : Active l’édition pour une tâche spécifique
  const handleEdit = (id: number, taskTitle: string, taskDescription?: string) => {
    setState((prev) => ({
      ...prev,
      editingTaskId: id,
      editingTitle: taskTitle,
      editingDescription: taskDescription || '',
    }));
  };

  // Définit la fonction handleUpdate pour sauvegarder les modifications
  // Arguments : id (ID de la tâche)
  // Syntaxe : async pour utiliser await
  // Rôle : Met à jour une tâche
  const handleUpdate = async (id: number) => {
    setState((prev) => ({ ...prev, error: '' }));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put<{ task: Task }>(
        `/api/tasks/${id}`,
        { title: state.editingTitle, description: state.editingDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task.id === id ? response.data.task : task
        ),
        editingTaskId: null,
        editingTitle: '',
        editingDescription: '',
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.response?.data.error || 'Failed to update task',
      }));
    }
  };

  // Définit la fonction handleCancelEdit pour annuler l’édition
  // Syntaxe : fonction fléchée
  // Rôle : Réinitialise l’état d’édition
  const handleCancelEdit = () => {
    setState((prev) => ({
      ...prev,
      editingTaskId: null,
      editingTitle: '',
      editingDescription: '',
    }));
  };

  // Définit la fonction handleFilterChange pour changer le filtre
  // Arguments : event (événement de changement)
  // Syntaxe : fonction fléchée
  // Rôle : Met à jour le filtre
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setState((prev) => ({ ...prev, filter: event.target.value as TaskListState['filter'] }));
  };

  // Définit la fonction handleSortChange pour changer le tri
  // Arguments : event (événement de changement)
  // Syntaxe : fonction fléchée
  // Rôle : Met à jour le tri
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setState((prev) => ({ ...prev, sort: event.target.value as TaskListState['sort'] }));
  };

  // Définit la fonction handleSearchChange pour gérer la recherche
  // Arguments : event (événement de changement)
  // Syntaxe : fonction fléchée
  // Rôle : Met à jour la requête de recherche
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, searchQuery: event.target.value }));
  };

  // Filtre et trie les tâches
  // Syntaxe : filter et sort appliquent des conditions
  // Rôle : Sélectionne et ordonne les tâches à afficher
  const filteredTasks = state.tasks.filter((task) => {
    const matchesFilter =
      state.filter === 'completed' ? task.completed : state.filter === 'incomplete' ? !task.completed : true;
    const matchesSearch = state.searchQuery
      ? task.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(state.searchQuery.toLowerCase()))
      : true;
    return matchesFilter && matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (state.sort === 'title-asc') return a.title.localeCompare(b.title);
    if (state.sort === 'title-desc') return b.title.localeCompare(a.title);
    if (state.sort === 'date-asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (state.sort === 'date-desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  // Retourne le JSX pour afficher le formulaire et la liste
  // Syntaxe : JSX décrit l’interface utilisateur
  // Rôle : Affiche un formulaire et une liste de tâches
  return (
    <div className="task-list">
      <h2>Task List</h2>
      {state.error && <p className="error">{state.error}</p>}
      <div className="filters">
        <label>Filter: </label>
        <select value={state.filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>
      <div className="filters">
        <label>Sort: </label>
        <select value={state.sort} onChange={handleSortChange}>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
          <option value="date-asc">Date (Oldest First)</option>
          <option value="date-desc">Date (Newest First)</option>
        </select>
      </div>
      <div className="filters">
        <label>Search: </label>
        <input
          type="text"
          value={state.searchQuery}
          onChange={handleSearchChange}
          placeholder="Search tasks..."
        />
      </div>
      <form onSubmit={handleCreate}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={state.title}
            onChange={(e) => setState((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={state.description}
            onChange={(e) => setState((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {sortedTasks.map((task) => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task.id, !task.completed)}
              className="task-checkbox"
            />
            {state.editingTaskId === task.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={state.editingTitle}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, editingTitle: e.target.value }))
                  }
                  className="edit-input"
                  autoFocus
                />
                <input
                  type="text"
                  value={state.editingDescription}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, editingDescription: e.target.value }))
                  }
                  className="edit-input"
                  placeholder="Description (optional)"
                />
                <button onClick={() => handleUpdate(task.id)} className="save-button">
                  Save
                </button>
                <button onClick={handleCancelEdit} className="cancel-button">
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="task-content">
                  <strong>{task.title}</strong>
                  {task.description && <p>{task.description}</p>}
                </div>
                <div className="task-actions">
                  <button onClick={() => handleEdit(task.id, task.title, task.description)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Exporte le composant TaskList
// Syntaxe : export default pour utilisation dans App.tsx
export default TaskList;