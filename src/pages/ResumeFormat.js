import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { BlobProvider } from "@react-pdf/renderer";
import { pdf } from '@react-pdf/renderer';
import "../styles/ResumeFormat.css";

// Import the PDF rendering components
import { ResumePDF } from "../components/ResumePDF";

const ResumeFormat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const [pdfStatus, setPdfStatus] = useState('idle'); // idle, generating, success, error
  const [customization, setCustomization] = useState({
    primaryColor: "#1a73e8",
    secondaryColor: "#f1f3f4",
    fontFamily: "Arial, sans-serif",
    fontSize: "medium",
    spacing: "normal",
  });

  // Define available format templates
  const formatTemplates = [
    {
      id: "professional",
      name: "Professional",
      description: "Clean and modern design for corporate environments",
      preview: "/images/formats/professional.jpg",
      primaryColor: "#1a73e8",
      secondaryColor: "#f1f3f4",
      fontFamily: "Arial, sans-serif",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Bold and colorful design for creative industries",
      preview: "/images/formats/creative.jpg",
      primaryColor: "#ff5722",
      secondaryColor: "#fbe9e7",
      fontFamily: "Verdana, sans-serif",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple and elegant design with focus on content",
      preview: "/images/formats/minimal.png",
      primaryColor: "#424242",
      secondaryColor: "#f5f5f5",
      fontFamily: "Tahoma, sans-serif",
    },
    {
      id: "executive",
      name: "Executive",
      description: "Sophisticated design for senior positions",
      preview: "/images/formats/executive.webp",
      primaryColor: "#263238",
      secondaryColor: "#eceff1",
      fontFamily: "Georgia, serif",
    },
    {
      id: "academic",
      name: "Academic",
      description: "Formal layout for academic and research positions",
      preview: "/images/formats/academic.webp",
      primaryColor: "#004d40",
      secondaryColor: "#e0f2f1",
      fontFamily: "Times New Roman, serif",
    },
  ];

  // Fetch resume data
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setResume(docSnap.data());
        } else {
          console.error("No resume found with that ID");
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  // Handle format selection
  const selectFormat = (format) => {
    setSelectedFormat(format);
    // Apply format's default customization options
    setCustomization({
      ...customization,
      primaryColor: format.primaryColor,
      secondaryColor: format.secondaryColor,
      fontFamily: format.fontFamily,
    });
    // Clear any previous PDF errors
    setPdfError(null);
    setPdfStatus('idle');
  };

  // Handle customization changes
  const handleCustomizationChange = (property, value) => {
    setCustomization((prev) => ({
      ...prev,
      [property]: value,
    }));
    // Reset PDF status when customization changes
    setPdfStatus('idle');
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate(`/resume/${id}`);
  };

  if (loading) {
    return <div className="loading">Loading resume data...</div>;
  }

  // Function to open the PDF in a new tab
  const openPdfInNewTab = async () => {
    setPdfStatus('generating');
    setPdfError(null);
    
    try {
      // Generate PDF blob
      const blob = await pdf(
        <ResumePDF
          resume={resume}
          format={selectedFormat}
          customization={customization}
        />
      ).toBlob();
      
      // Create a blob URL and open it in new tab
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      
      // Clean up the blob URL after a delay to ensure it loads
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 30000);
      
      setPdfStatus('success');
    } catch (error) {
      console.error("Error generating PDF:", error);
      setPdfError("Failed to generate PDF with selected fonts. Trying fallback...");
      setPdfStatus('error');
      
      // Try with fallback fonts
      try {
        // Use a reliable fallback font configuration
        const fallbackCustomization = {
          ...customization,
          fontFamily: "Tahoma, sans-serif" // Using our locally bundled Tahoma
        };
        
        const blob = await pdf(
          <ResumePDF
            resume={resume}
            format={selectedFormat}
            customization={fallbackCustomization}
          />
        ).toBlob();
        
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 30000);
        
        setPdfStatus('success');
        setPdfError("Used fallback font due to font loading issues, but PDF generated successfully.");
      } catch (fallbackError) {
        console.error("Fallback PDF generation failed:", fallbackError);
        setPdfError("PDF generation failed. Please try a different browser or font.");
        setPdfStatus('error');
      }
    }
  };

  return (
    <div className="resume-format-container">
      {/* Header with back button */}
      <div className="format-header">
        <button className="back-button" onClick={handleBackClick}>
          <span className="back-arrow">&#8592;</span> Back to Editor
        </button>
        <h1>Choose Resume Format</h1>
      </div>

      {/* Format selection if no format is selected yet */}
      {!selectedFormat && (
        <div className="format-selection">
          <div className="format-grid">
            {formatTemplates.map((format) => (
              <div
                key={format.id}
                className="format-card"
                onClick={() => selectFormat(format)}
              >
                <div className="format-preview" style={{ backgroundColor: format.secondaryColor }}>
                  <img src={format.preview} alt={format.name} />
                </div>
                <div className="format-info">
                  <h3>{format.name}</h3>
                  <p>{format.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resume preview and customization if format is selected */}
      {selectedFormat && resume && (
        <div className="resume-editor-layout">
          {/* Customization sidebar */}
          <div className="customization-sidebar">
            <h2>Customize Format</h2>
            
            <div className="customization-section">
              <label>Primary Color</label>
              <input
                type="color"
                value={customization.primaryColor}
                onChange={(e) => handleCustomizationChange("primaryColor", e.target.value)}
              />
            </div>
            
            <div className="customization-section">
              <label>Secondary Color</label>
              <input
                type="color"
                value={customization.secondaryColor}
                onChange={(e) => handleCustomizationChange("secondaryColor", e.target.value)}
              />
            </div>
            
            <div className="customization-section">
              <label>Font Family</label>
              <select
                value={customization.fontFamily}
                onChange={(e) => handleCustomizationChange("fontFamily", e.target.value)}
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="Calibri, sans-serif">Calibri</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Times New Roman, serif">Times New Roman</option>
                <option value="Tahoma, sans-serif">Tahoma</option>
                <option value="Verdana, sans-serif">Verdana</option>
              </select>
            </div>
            
            <div className="customization-section">
              <label>Font Size</label>
              <select
                value={customization.fontSize}
                onChange={(e) => handleCustomizationChange("fontSize", e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div className="customization-section">
              <label>Spacing</label>
              <select
                value={customization.spacing}
                onChange={(e) => handleCustomizationChange("spacing", e.target.value)}
              >
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="spacious">Spacious</option>
              </select>
            </div>

            {pdfError && (
                <div className="status-message error-message">
                    {pdfError}
                </div>
            )}
            
            {pdfStatus === 'success' && !pdfError && (
                <div className="status-message success-message">
                    PDF generated successfully! Check your new tab.
                </div>
            )}
            
            {/* Preview PDF buttons */}
            <div className="download-section">
              <button 
                onClick={openPdfInNewTab} 
                className="download-btn"
                disabled={pdfStatus === 'generating'}
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                  padding: "10px 20px",
                  backgroundColor: "#1a73e8",
                  color: "white",
                  borderRadius: "4px",
                  border: "none",
                  cursor: pdfStatus === 'generating' ? "wait" : "pointer"
                }}
              >
                {pdfStatus === 'generating' ? 'Generating PDF...' : 'Preview PDF in New Tab'}
              </button>
              
              {/* BlobProvider as an alternative method */}
              <BlobProvider
                document={
                  <ResumePDF
                    resume={resume}
                    format={selectedFormat}
                    customization={{
                      ...customization,
                      fontFamily: "Fallback" // Always using safe font for this option
                    }}
                  />
                }
              >
                {({ blob, url, loading, error }) => (
                  <button
                    onClick={() => {
                      if (url) window.open(url, '_blank');
                    }}
                    disabled={loading || !url}
                    className="download-btn-fallback"
                  >
                    {loading ? 'Preparing Alternative View...' : 'Alternative Preview (Fallback Font)'}
                  </button>
                )}
              </BlobProvider>

              <button className="format-select-btn" onClick={() => setSelectedFormat(null)}>
                Choose Another Format
              </button>
            </div>
          </div>

          {/* Resume preview */}
          <div className="resume-preview-container">
            <div 
              className="resume-preview" 
              style={{
                fontFamily: customization.fontFamily,
                fontSize: customization.fontSize === "small" ? "0.9rem" : 
                           customization.fontSize === "large" ? "1.1rem" : "1rem",
                lineHeight: customization.spacing === "compact" ? "1.3" : 
                           customization.spacing === "spacious" ? "1.8" : "1.5",
              }}
            >
              {/* Dynamic content based on selected format and resume data */}
              <div className={`resume-template template-${selectedFormat.id}`}>
                {/* Header */}
                <div 
                  className="resume-header" 
                  style={{ backgroundColor: customization.primaryColor }}
                >
                  <h1 className="applicant-name">{resume.applicantName}</h1>
                  <h2 className="job-position">{resume.jobPosition}</h2>
                  
                  <div className="contact-info">
                    {resume.email && <div className="contact-item">{resume.email}</div>}
                    {resume.phone && <div className="contact-item">{resume.phone}</div>}
                    {(resume.city || resume.state || resume.country) && (
                      <div className="contact-item">
                        {[resume.city, resume.state, resume.country].filter(Boolean).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Body - this is where formats would differ more significantly */}
                <div className="resume-body">
                  {/* Professional Summary */}
                  {resume.professionalSummary && (
                    <div className="resume-section">
                      <h3 
                        className="section-title"
                        style={{ color: customization.primaryColor, borderBottomColor: customization.primaryColor }}
                      >
                        Professional Summary
                      </h3>
                      <div className="section-content">{resume.professionalSummary}</div>
                    </div>
                  )}
                  
                  {/* Work Experience */}
                  {resume.workExperiences && resume.workExperiences.length > 0 && (
                    <div className="resume-section">
                      <h3 
                        className="section-title"
                        style={{ color: customization.primaryColor, borderBottomColor: customization.primaryColor }}
                      >
                        Work Experience
                      </h3>
                      <div className="section-content">
                        {resume.workExperiences.map((experience, index) => (
                          <div key={index} className="experience-item">
                            <div className="experience-header">
                              <h4 className="company-name">{experience.company}</h4>
                              <span className="duration">{experience.duration}</span>
                            </div>
                            <div className="role">{experience.role}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Education */}
                  {resume.education && (
                    <div className="resume-section">
                      <h3 
                        className="section-title"
                        style={{ color: customization.primaryColor, borderBottomColor: customization.primaryColor }}
                      >
                        Education
                      </h3>
                      <div className="section-content">{resume.education}</div>
                    </div>
                  )}
                  
                  {/* Skills */}
                  {resume.skills && resume.skills.length > 0 && (
                    <div className="resume-section">
                      <h3 
                        className="section-title"
                        style={{ color: customization.primaryColor, borderBottomColor: customization.primaryColor }}
                      >
                        Skills
                      </h3>
                      <div className="skills-container">
                        {resume.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="skill-tag"
                            style={{ 
                              backgroundColor: customization.secondaryColor,
                              color: customization.primaryColor
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Languages */}
                  {resume.languages && resume.languages.length > 0 && (
                    <div className="resume-section">
                      <h3 
                        className="section-title"
                        style={{ color: customization.primaryColor, borderBottomColor: customization.primaryColor }}
                      >
                        Languages
                      </h3>
                      <div className="languages-container">
                        {resume.languages.map((language, index) => (
                          <span 
                            key={index} 
                            className="language-tag"
                            style={{ 
                              backgroundColor: customization.secondaryColor,
                              color: customization.primaryColor
                            }}
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeFormat;