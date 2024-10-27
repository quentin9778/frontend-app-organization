"use client"; // Indique que ce fichier est un Client Component
import { useEffect, useState } from "react";
import axios from 'axios';
import { Task } from "@/types/types";

import TaskCard from "@/components/TaskCard";
import Popup from "@/components/Popup";
import Form from "@/components/Form";
import { useUser } from "@clerk/nextjs";
import ProtectedRoute from "@/components/ProtectedRoute";



const Page = () => {
    // State pour gérer le texte affiché
    const { isSignedIn, user } = useUser();
    const [userName, setUserName] = useState<string>(""); 
    const apiToDoUrl = process.env.NEXT_PUBLIC_API_TODOLIST_URL;

    const [data, setData] = useState<Task[] | null>(null); // Data est soit un tableau de Task, soit null
    const [task, setTask] = useState<Task>({
        id: 0, // Pour une nouvelle tâche, l'ID sera généré par le backend
        userName: userName,
        name: '',
        tag: '',
        description: '',
        datePlanned: '',
        dateDone: null,
        category: null
    });


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupDelete, setShowPopupDelete] = useState(false);
    const [showPopupUpdate, setShowPopupUpdate] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
        setError(null); // Réinitialiser l'erreur si la popup est réouverte
        setData(null);
    };

    const togglePopupDelete = () => {
        setShowPopupDelete(!showPopupDelete);
        setError(null); // Réinitialiser l'erreur si la popup est réouverte
        if (showPopupDelete) {
            setTask({
                id: 0,
                userName:userName,
                name: '',
                tag: '',
                description: '',
                datePlanned: null,
                dateDone: null,
                category: null,
            });}
        console.log(task)

    };

    const togglePopupUpdate = () => {
        setShowPopupUpdate(!showPopupUpdate);
        if (showPopupUpdate) {
            setTask({
                id: 0,
                userName:userName,
                name: '',
                tag: '',
                description: '',
                datePlanned: null,
                dateDone: null,
                category: null,
            });
        }
    };
    
    const handleDeleteClick = (taskToDelete: Task) => {
        setTask({ ...taskToDelete }); // Remplit le state avec les valeurs actuelles de la tâche
        togglePopupDelete(); // Affiche la popup pour l'édition
    }


    const handleEditClick = (taskToEdit: Task) => {
        setTask({ ...taskToEdit }); // Remplit le state avec les valeurs actuelles de la tâche
        togglePopupUpdate(); // Affiche la popup pour l'édition
    }
    
    const formatDateToLocalDate = (date: Date) => {
        return date.toISOString().split('T')[0]; // Extrait seulement la partie "YYYY-MM-DD"
    };

    // Fonction pour gérer les changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };




    // Fonction pour envoyer les données à l'API de création de tâche
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiToDoUrl}/tasks`, task);
            console.log('Tâche créée avec succès', response.data);
            // Fermer la popup après la création
            togglePopup();

            // Ajouter la nouvelle tâche dans l'état local
            setData((prevData) => prevData ? [...prevData, response.data] : [response.data]);
            setTask({
                name: '',
                userName:userName,
                tag: '',
                description: '',
                datePlanned: null,
                dateDone: null,
                category: null,
            });
        } catch (error) {
            console.error('Erreur lors de la création de la tâche:', error);
            setError('Erreur lors de la création de la tâche');
        }
    };
    // Fonction pour envoyer les données à l'API de création de tâche
    const handleUpdate = async (e: React.FormEvent, id: number) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${apiToDoUrl}/tasks/${id}`, task);
            console.log('Tâche mise à jour avec succès', response.data);
            // Fermer la popup après la mise à jour
            togglePopupUpdate();
    
            // Mettre à jour la tâche dans l'état local
            setData((prevData) => 
                prevData ? prevData.map(t => t.id === id ? response.data : t) : [response.data]
            );
    
            // Réinitialiser le formulaire
            setTask({
                name: '',
                userName:userName,
                tag: '',
                description: '',
                datePlanned: null,
                dateDone: null,
                category: null,
            });
        } catch (error) {
            console.error('Erreur lors de la modification de la tâche:', error);
            setError('Erreur lors de la modification de la tâche');
        }
    };    

    const deleteTask = async (id: number) => {

        try {
            const response = await axios.delete(`${apiToDoUrl}/tasks/${id}`);
            console.log('Tâche supprimée avec succès', response.data);
            togglePopupDelete();
            setData((prevData) => prevData?.filter(task => task.id !== id) || null);
        } catch (error) {
            console.error('Erreur lors de la suppression de la tâche:', error);
            setError('Erreur lors de la suppression de la tâche');
            togglePopupDelete();
        }
    };

    const handleStatusChange = async (task: Task) => {
        try {
            const isDone = task.status === 'Done';
            const updatedTask = {
                ...task,
                status: isDone ? 'Pending' : 'Done', // Inverse le statut correctement
                dateDone: isDone ? null : formatDateToLocalDate(new Date())
            };

            const response = await axios.put(`${apiToDoUrl}/tasks/${task.id}`, updatedTask);
            console.log('Tâche mise à jour avec succès', response.data);

            // Mise à jour locale de l'état
            setData(prevData =>
                prevData?.map(t =>
                    t.id === task.id ? { ...t, status: response.data.status, dateDone: response.data.dateDone } : t
                ) || null
            );
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut de la tâche:', error);
            setError('Erreur lors de la mise à jour de la tâche');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (isSignedIn && user) {
                const currentUserName = user.username; 
                setUserName(currentUserName ?? "");
                console.log("API URL:", process.env.NEXT_PUBLIC_API_TODOLIST_URL);
                console.log("Username:", currentUserName);

                try {
                    const response = await axios.get<Task[]>(`${apiToDoUrl}/tasks/${currentUserName}`);
                    console.log("Données récupérées :", response.data);
                    setData(response.data);
                } catch (error) {
                    console.error("Erreur lors de la requête :", error);
                    setError('Une erreur est survenue lors de la récupération des tâches.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false); // Si l'utilisateur n'est pas connecté
            }
        };
    
        fetchData();
    }, [isSignedIn, user, apiToDoUrl])


    return (
        <ProtectedRoute>
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1 className="text-6xl font-bold text-blue-800/100 ">TO DO List</h1>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div>
                    <button onClick={togglePopup } className="bg-green-700" >Create new task</button>
                    <Popup title="Créer une tâche" isOpen={showPopup}>
                    <br/>
                    <Form 
                                task={task}
                                error={error}
                                handleChange={handleChange}
                                handleSubmit={handleSubmit}
                                submitLabel="Valider"
                                onClose={togglePopup} 
                                />
                    </Popup>
                </div>
                    )}
                    <br/>
               <ul>
                    {data && data.map(item => (
                        <div key={item.id}>
                    <TaskCard
                                key={item.id}
                                task={item}
                                onDelete={handleDeleteClick}
                                onEdit={handleEditClick}
                                onStatusChange={handleStatusChange} />
                    <Popup title="Delete a task" isOpen={showPopupDelete} >
                            <br/>
                            <p>Do you really want to delete this task ?</p>
                            <br/>
                            <div className="flex space-x-4 justify-center">
                            <button onClick={() => {

                                    if (task.id !== undefined) {
                                        deleteTask(task.id);
                                        }
                                    }} >Delete
                            </button>
                            <button onClick={togglePopupDelete}>Close</button>
                            </div>
                    </Popup>
                    <Popup title="Update a task" isOpen={showPopupUpdate} >
                        <br/>
                        <Form
                            task={task} 
                            error={error} 
                            handleChange={handleChange} 
                            handleSubmit={(e) => 
                            task.id !== undefined ? handleUpdate(e, task.id) : console.error('ID of the task undefined')
                              }          
                            submitLabel="Validate"
                            onClose={togglePopupUpdate}
                            />
                    </Popup></div>
  ))}
</ul>
<footer className="flex gap-4 justify-center items-center flex-col sm:flex-row mt-6">
    <a
      href="/"
      className="flex rounded-full shadow-lg transition-transform transform hover:scale-105 bg-green-500 text-white font-semibold hover:bg-green-700 text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 justify-center items-center"
    >
      Return to Home
    </a>
  </footer>

                </div>
                </ProtectedRoute>
            )}

export default Page;