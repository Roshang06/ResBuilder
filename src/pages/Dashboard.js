import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchProjects(currentUser.uid);
      } else {
        setProjects([]);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);


  const fetchProjects = async (userId) => {
    try {
      const q = query(collection(db, "projects"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const loadedProjects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(loadedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }
    }
  };


  const addNewProject = async () => {
    if (!user) return;

    try {
      const newProject = {
        userId: user.uid,
        title: `New Resume Project ${projects.length + 1}`,
        projectName: `New Resume Project ${projects.length + 1}`, // Set both title and projectName
        workExperiences: [], // Initialize with empty array
        skills: [], // Initialize with empty array
        languages: [], // Initialize with empty array
        
      };

      const docRef = await addDoc(collection(db, "projects"), newProject);
      setProjects((prevProjects) => [...prevProjects, { id: docRef.id, ...newProject }]);
    } catch (error) {
      console.error("Error adding project:", error);
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }
    }
  };

  // Navigate to resume editor
  const openResumeEditor = (id) => {
    navigate(`/resume/${id}`);
  };

  // Logout and clear state
  const handleLogout = async () => {
    await signOut(auth);
    setProjects([]);
    navigate("/login");
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }
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
            <h2>{project.projectName || project.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;


