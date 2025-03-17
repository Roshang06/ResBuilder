import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase"; // ✅ Import Firestore
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"; // ✅ Firestore functions
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // ✅ Listen for authentication state changes and fetch projects
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

  // ✅ Fetch resume projects from Firestore
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
    }
  };

  // ✅ Add new resume project to Firestore
  const addNewProject = async () => {
    if (!user) return;

    try {
      const newProject = {
        userId: user.uid,
        title: `New Resume Project ${projects.length + 1}`,
      };

      const docRef = await addDoc(collection(db, "projects"), newProject);
      setProjects((prevProjects) => [...prevProjects, { id: docRef.id, ...newProject }]); // ✅ Keep existing projects
    } catch (error) {
      console.error("Error adding project:", error);
    }
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





