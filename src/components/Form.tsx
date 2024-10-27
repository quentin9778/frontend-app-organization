import { Task } from "@/types/types";


interface FormProps {
  task: Task;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  onClose: () => void;
}
                     
const Form: React.FC<FormProps> = ({ task, error, handleChange, handleSubmit, submitLabel, onClose }) => {
  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '10px', color: '#fff' }}>
      <div>
        <label>
          Nom de la tâche:
          <input
            type="text"
            name="name"
            value={task.name}
            onChange={handleChange}
            required
            style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px', color: '#000' }}
          />
        </label>
      </div>
      <br/>
      <div>
        <label>
          Tag:
          <input
            type="text"
            name="tag"
            value={task.tag}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px', color: '#000' }}
          />
        </label>
        <br/>
        <label>
          Date Planned:
          <input
            type="text"
            name="datePlanned"
            value={task.datePlanned ? task.datePlanned : ''}  // Si null, utilise une chaîne vide
            onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px', color: '#000' }}
          />
        </label>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <br/>
      <div className="flex space-x-4 justify-center">
      <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
        {submitLabel}
      </button>
      <button onClick={onClose}>Close</button>
      </div>
    </form>
  );
};

export default Form;