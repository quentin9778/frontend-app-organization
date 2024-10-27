// types.ts

// Type pour représenter une tâche
export type Task = {
    id?: number;
    userName: string;
    name: string;
    tag?: string;
    status?: 'Unplanned' | 'Pending' | 'Done' | null;  // Statuts possibles
    description?: string;
    datePlanned?: string | null;  // Date planifiée (format ISO, ex: YYYY-MM-DD)
    dateDone?: string | null;  // Date de fin (format ISO)
    category?: string | null;
  };
  
  // Type pour représenter un utilisateur
  export type User = {
    id: number;
    name: string;
    email: string;
    tasks?: Task[];  // Liste des tâches associées à l'utilisateur
  };
  
  // Type pour les paramètres d'authentification
  export type AuthCredentials = {
    email: string;
    password: string;
  };
  
  // Type pour une catégorie de tâches (si tu as un système de catégories)
  export type Category = {
    id: number;
    name: string;
  };
  
  // Type pour la réponse d'une API de pagination
  export type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
  };
  
  // Type pour une réponse d'erreur API
  export type APIError = {
    message: string;
    statusCode: number;
  };
  