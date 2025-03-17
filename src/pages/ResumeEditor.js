import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import "../styles/ResumeEditor.css";

const ResumeEditor = () => {
  const { id } = useParams(); // Get the resume ID from the URL

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

  return (
    <div className="resume-editor-container">
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
    </div>
  );
};

export default ResumeEditor;

