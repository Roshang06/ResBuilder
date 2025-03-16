import React from "react";
import { useParams } from "react-router-dom";
import "../styles/ResumeEditor.css";

const ResumeEditor = () => {
  const { id } = useParams(); // Get the resume ID from the URL

  return (
    <div className="resume-editor-container">
      <h1>Editing Resume {id}</h1>
      <textarea placeholder="Enter your resume details here..." className="resume-textarea" />
    </div>
  );
};

export default ResumeEditor;
