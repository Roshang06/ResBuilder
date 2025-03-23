import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import "../styles/ResumeEditor.css";

const ResumeEditor = () => {
  const { id } = useParams(); // Get the resume ID from the URL
  const navigate = useNavigate(); // Add navigate for redirection
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation popup
  
  // Predefined lists for dropdowns
  const predefinedSkills = [
    "JavaScript", "React", "Node.js", "HTML", "CSS", "Python", "Java", "C++", "SQL", 
    "Firebase", "MongoDB", "AWS", "Project Management", "Communication", "Problem Solving",
    "Leadership", "Teamwork", "Microsoft Office", "Data Analysis", "Machine Learning"
  ];
  
  const predefinedLanguages = [
    "English", "Spanish", "French", "German", "Chinese", "Japanese", "Russian", "Arabic",
    "Portuguese", "Italian", "Korean", "Hindi", "Dutch", "Swedish", "Norwegian"
  ];

  // States for dropdown input
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [showLanguagesDropdown, setShowLanguagesDropdown] = useState(false);

  // Ensure proper data structure for the state
  const [resume, setResume] = useState({
    projectName: "",
    jobPosition: "",
    applicantName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    professionalSummary: "",
    education: "",
    skills: [], // Array for multiple skills
    workExperiences: [], // Array for work experiences
    languages: [], // Array for multiple languages
  });

  // Get the correct resume details from Firestore
  useEffect(() => {
    const fetchResume = async () => {
      const docRef = doc(db, "projects", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setResume({
          ...data,
          professionalSummary: data.professionalSummary || "",
          education: data.education || "",
          skills: Array.isArray(data.skills) ? data.skills : [],
          workExperiences: Array.isArray(data.workExperiences) ? data.workExperiences : [],
          languages: Array.isArray(data.languages) ? data.languages : [],
        });
      }
    };

    fetchResume();
  }, [id]);

  // Save changes to Firestore
  const saveResume = async () => {
    await setDoc(doc(db, "projects", id), resume);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setResume((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new work experience entry
  const addWorkExperience = () => {
    setResume((prev) => ({
      ...prev,
      workExperiences: [...prev.workExperiences, { company: "", role: "", duration: "" }],
    }));
  };

  // Handle removing the last work experience entry
  const removeLastWorkExperience = () => {
    if (resume.workExperiences.length > 0) {
      const updatedExperiences = [...resume.workExperiences];
      updatedExperiences.pop(); // Remove the last item
      setResume((prev) => ({ ...prev, workExperiences: updatedExperiences }));
      saveResume(); // Save changes immediately
    }
  };

  // Handle updating a specific work experience entry
  const updateWorkExperience = (index, field, value) => {
    const updatedExperiences = [...resume.workExperiences];
    updatedExperiences[index][field] = value;
    setResume((prev) => ({ ...prev, workExperiences: updatedExperiences }));
  };

  // Filter skills based on input
  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    
    if (value.trim() === "") {
      setFilteredSkills([]);
      setShowSkillsDropdown(false);
    } else {
      const filtered = predefinedSkills.filter(skill => 
        skill.toLowerCase().includes(value.toLowerCase()) && 
        !resume.skills.includes(skill)
      );
      setFilteredSkills(filtered);
      setShowSkillsDropdown(true);
    }
  };

  // Filter languages based on input
  const handleLanguageInputChange = (e) => {
    const value = e.target.value;
    setLanguageInput(value);
    
    if (value.trim() === "") {
      setFilteredLanguages([]);
      setShowLanguagesDropdown(false);
    } else {
      const filtered = predefinedLanguages.filter(language => 
        language.toLowerCase().includes(value.toLowerCase()) && 
        !resume.languages.includes(language)
      );
      setFilteredLanguages(filtered);
      setShowLanguagesDropdown(true);
    }
  };

  // Add a skill from dropdown or custom input
  const addSkill = (skill = null) => {
    const skillToAdd = skill || skillInput.trim();
    
    if (skillToAdd && !resume.skills.includes(skillToAdd)) {
      const updatedSkills = [...resume.skills, skillToAdd];
      setResume((prev) => ({ ...prev, skills: updatedSkills }));
      setSkillInput("");
      setFilteredSkills([]);
      setShowSkillsDropdown(false);
      saveResume();
    }
  };

  // Add a language from dropdown or custom input
  const addLanguage = (language = null) => {
    const languageToAdd = language || languageInput.trim();
    
    if (languageToAdd && !resume.languages.includes(languageToAdd)) {
      const updatedLanguages = [...resume.languages, languageToAdd];
      setResume((prev) => ({ ...prev, languages: updatedLanguages }));
      setLanguageInput("");
      setFilteredLanguages([]);
      setShowLanguagesDropdown(false);
      saveResume();
    }
  };

  // Remove a skill
  const removeSkill = (skillToRemove) => {
    const updatedSkills = resume.skills.filter(skill => skill !== skillToRemove);
    setResume((prev) => ({ ...prev, skills: updatedSkills }));
    saveResume();
  };

  // Remove a language
  const removeLanguage = (languageToRemove) => {
    const updatedLanguages = resume.languages.filter(language => language !== languageToRemove);
    setResume((prev) => ({ ...prev, languages: updatedLanguages }));
    saveResume();
  };

  // New function to show delete confirmation popup
  const showDeleteConfirmation = () => {
    setShowDeleteConfirm(true);
  };

  // New function to handle resume deletion
  const deleteResume = async () => {
    try {
      await deleteDoc(doc(db, "projects", id));
      navigate("/dashboard"); // Redirect to dashboard after deletion
    } catch (error) {
      console.error("Error deleting resume:", error);
      // Could add error state handling here if needed
    }
  };

  // New function to handle back button click - save and navigate
  const handleBackClick = async () => {
    await saveResume(); // Save all changes
    navigate("/dashboard"); // Go back to dashboard
  };

  const handleFormatPreview = async () => {
    await saveResume(); // Save all changes first
    navigate(`/resume-format/${id}`); // Navigate to the format selection page with the resume ID
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

      <label>Professional Summary:</label>
      <textarea 
        name="professionalSummary" 
        value={resume.professionalSummary} 
        onChange={handleChange} 
        onBlur={saveResume}
        placeholder="Write a professional summary..."
        rows={4}
      />

      <label>Education:</label>
      <textarea 
        name="education" 
        value={resume.education} 
        onChange={handleChange} 
        onBlur={saveResume}
        placeholder="List your education..."
        rows={3}
      />

      <label>Skills:</label>
      <div className="dropdown-container">
        <div className="input-with-button">
          <input 
            type="text" 
            value={skillInput} 
            onChange={handleSkillInputChange}
            placeholder="Search or add skills..."
            onFocus={() => skillInput.trim() !== "" && setShowSkillsDropdown(true)}
            onBlur={() => setTimeout(() => setShowSkillsDropdown(false), 200)}
          />
          <button type="button" onClick={() => addSkill()}>Add</button>
        </div>
        
        {showSkillsDropdown && filteredSkills.length > 0 && (
          <div className="dropdown-list">
            {filteredSkills.map((skill, index) => (
              <div 
                key={index} 
                className="dropdown-item"
                onClick={() => addSkill(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
        )}
        
        <div className="tags-container">
          {resume.skills.map((skill, index) => (
            <div key={index} className="tag">
              {skill}
              <span className="tag-remove" onClick={() => removeSkill(skill)}>×</span>
            </div>
          ))}
        </div>
      </div>

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
      <div className="button-group">
        <button onClick={addWorkExperience}>+ Add Work Experience</button>
        {resume.workExperiences.length > 0 && (
          <button onClick={removeLastWorkExperience} className="delete-work-btn">
            - Remove Last Work Experience
          </button>
        )}
      </div>
      
      <label>Languages:</label>
      <div className="dropdown-container">
        <div className="input-with-button">
          <input 
            type="text" 
            value={languageInput} 
            onChange={handleLanguageInputChange}
            placeholder="Search or add languages..."
            onFocus={() => languageInput.trim() !== "" && setShowLanguagesDropdown(true)}
            onBlur={() => setTimeout(() => setShowLanguagesDropdown(false), 200)}
          />
          <button type="button" onClick={() => addLanguage()}>Add</button>
        </div>
        
        {showLanguagesDropdown && filteredLanguages.length > 0 && (
          <div className="dropdown-list">
            {filteredLanguages.map((language, index) => (
              <div 
                key={index} 
                className="dropdown-item"
                onClick={() => addLanguage(language)}
              >
                {language}
              </div>
            ))}
          </div>
        )}
        
        <div className="tags-container">
          {resume.languages.map((language, index) => (
            <div key={index} className="tag">
              {language}
              <span className="tag-remove" onClick={() => removeLanguage(language)}>×</span>
            </div>
          ))}
        </div>
      </div>
      
      <button className="format-preview-btn" onClick={handleFormatPreview}>
        Format & Preview Resume
      </button>
      
      {/* Delete Resume Button */}
      <div>
        <button className="delete-btn" onClick={showDeleteConfirmation}>
          Delete Resume
        </button>
      </div>

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