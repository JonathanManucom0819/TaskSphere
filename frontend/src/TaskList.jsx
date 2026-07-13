import { useEffect, useState } from "react";
import axios from "axios";

function TaskList() {

    const [tasks, setTasks] = useState([]);

    useEffect(() => {

        axios.get("http://127.0.0.1:8000/api/tasks/")
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error("Error fetching tasks:", error);
            });

    }, []);


    return (
        <div>
            <h1>Task List</h1>

            {tasks.map(task => (
                <div key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>Status: {task.status}</p>
                </div>
            ))}

        </div>
    );
}

export default TaskList;