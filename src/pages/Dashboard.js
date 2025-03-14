import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css"; // Import CSS for styling

function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([
    { id: 1, title: "My First Resume" },
    { id: 2, title: "Software Engineer Resume" },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const addNewProject = () => {
    const newProject = {
      id: projects.length + 1,
      title: `New Resume Project ${projects.length + 1}`,
    };
    setProjects([...projects, newProject]);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        {user && (
          <div className="user-info">
            <p>{user.email}</p>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>

      {/* Resume Projects Section */}
      <div className="project-container">
        <div className="project-card add-card" onClick={addNewProject}>
          <h2>+ Add Resume Project</h2>
        </div>
        {projects.map((project) => (
          <div className="project-card" key={project.id} onClick={() => alert(`Opening ${project.title}`)}>
            <h2>{project.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
