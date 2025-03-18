import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import "../styles/ResumeEditor.css";

const ResumeEditor = () => {
  const { id } = useParams(); // Get the resume ID from the URL
  const navigate = useNavigate(); // Add navigate for redirection
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation popup

  // ✅ Ensure `workExperiences` is always an array
  const [resume, setResume] = useState({
    projectName: "",
    jobPosition: "",
    applicantName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    profileSummary: "",
    priorEducation: "",
    skills: "",
    workExperiences: [], // ✅ Always set this as an empty array
    languages: "",
  });

  // ✅ Fetch resume details from Firestore
  useEffect(() => {
    const fetchResume = async () => {
      const docRef = doc(db, "projects", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setResume({
          ...data,
          workExperiences: data.workExperiences || [], // ✅ Ensure this is always an array
        });
      }
    };

    fetchResume();
  }, [id]);

  // ✅ Save changes to Firestore
  const saveResume = async () => {
    await setDoc(doc(db, "projects", id), resume);
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setResume((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle adding a new work experience entry
  const addWorkExperience = () => {
    setResume((prev) => ({
      ...prev,
      workExperiences: [...prev.workExperiences, { company: "", role: "", duration: "" }],
    }));
  };

  // ✅ Handle updating a specific work experience entry
  const updateWorkExperience = (index, field, value) => {
    const updatedExperiences = [...resume.workExperiences];
    updatedExperiences[index][field] = value;
    setResume((prev) => ({ ...prev, workExperiences: updatedExperiences }));
  };

  // ✅ New function to show delete confirmation popup
  const showDeleteConfirmation = () => {
    setShowDeleteConfirm(true);
  };

  // ✅ New function to handle resume deletion
  const deleteResume = async () => {
    try {
      await deleteDoc(doc(db, "projects", id));
      navigate("/dashboard"); // Redirect to dashboard after deletion
    } catch (error) {
      console.error("Error deleting resume:", error);
      // Could add error state handling here if needed
    }
  };

  // ✅ New function to handle back button click - save and navigate
  const handleBackClick = async () => {
    await saveResume(); // Save all changes
    navigate("/dashboard"); // Go back to dashboard
  };

  return (
    <div className="resume-editor-container">
      {/* Back button */}
      <button className="back-button" onClick={handleBackClick}>
        <span className="back-arrow">&#8592;</span> Back
      </button>
      
      <h1>Edit Resume</h1>

      <label>Project Name:</label>
      <input type="text" name="projectName" value={resume.projectName} onChange={handleChange} onBlur={saveResume} />

      <label>Job Position:</label>
      <input type="text" name="jobPosition" value={resume.jobPosition} onChange={handleChange} onBlur={saveResume} />

      <label>Applicant Name:</label>
      <input type="text" name="applicantName" value={resume.applicantName} onChange={handleChange} onBlur={saveResume} />

      <label>Email:</label>
      <input type="email" name="email" value={resume.email} onChange={handleChange} onBlur={saveResume} />

      <label>Phone Number:</label>
      <input type="text" name="phone" value={resume.phone} onChange={handleChange} onBlur={saveResume} />

      <h2>Work Experience</h2>
      {resume.workExperiences.map((experience, index) => (
        <div key={index} className="work-experience">
          <input
            type="text"
            placeholder="Company Name"
            value={experience.company}
            onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
          />
          <input
            type="text"
            placeholder="Role"
            value={experience.role}
            onChange={(e) => updateWorkExperience(index, "role", e.target.value)}
          />
          <input
            type="text"
            placeholder="Duration"
            value={experience.duration}
            onChange={(e) => updateWorkExperience(index, "duration", e.target.value)}
          />
        </div>
      ))}
      <button onClick={addWorkExperience}>+ Add Work Experience</button>
      
      {/* Delete Resume Button */}
      <button className="delete-btn" onClick={showDeleteConfirmation}>
        Delete Resume
      </button>

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-popup">
            <h3>Delete Resume?</h3>
            <p>Are you sure you want to delete this resume? This action cannot be undone.</p>
            <div className="delete-confirm-buttons">
              <button onClick={deleteResume} className="delete-confirm-yes">
                Yes, Delete
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="delete-confirm-no">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeEditor;