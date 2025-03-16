import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // ✅ Load projects from local storage when user logs in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadProjects(currentUser.uid);
      } else {
        setProjects([]);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // ✅ Load projects from local storage per user
  const loadProjects = (userId) => {
    const savedProjects = localStorage.getItem(`projects_${userId}`);
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  };

  // ✅ Save projects to local storage per user
  const saveProjects = (userId, projects) => {
    localStorage.setItem(`projects_${userId}`, JSON.stringify(projects));
  };

  // ✅ Add new project and save to local storage
  const addNewProject = () => {
    if (!user) return;

    const newProject = {
      id: projects.length + 1,
      title: `New Resume Project ${projects.length + 1}`,
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveProjects(user.uid, updatedProjects); // ✅ Save to local storage
  };

  // ✅ Navigate to resume editor
  const openResumeEditor = (id) => {
    navigate(`/resume/${id}`);
  };

  // ✅ Logout and clear state
  const handleLogout = async () => {
    await signOut(auth);
    setProjects([]);
    navigate("/login");
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
          <div className="project-card" key={project.id} onClick={() => openResumeEditor(project.id)}>
            <h2>{project.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;




