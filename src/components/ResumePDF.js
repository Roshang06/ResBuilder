import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register built-in PDF fonts as fallbacks
Font.registerHyphenationCallback(word => [word]);

// Register locally bundled fonts
Font.register({
  family: 'Arial',
  fonts: [
    { src: '/fonts/arial/arial.ttf' }, // Regular
    { src: '/fonts/arial/arial.ttf', fontWeight: 700 }, // Bold
    { src: '/fonts/arial/arial.ttf', fontStyle: 'italic' }, // Italic
    { src: '/fonts/arial/arial.ttf', fontWeight: 700, fontStyle: 'italic' } // Bold Italic
  ]
});

Font.register({
  family: 'Georgia',
  fonts: [
    { src: '/fonts/georgia/georgia.ttf' }, // Regular
    { src: '/fonts/georgia/georgia.ttf', fontWeight: 700 }, // Bold
    { src: '/fonts/georgia/georgia.ttf', fontStyle: 'italic' }, // Italic
  ]
});

Font.register({
  family: 'Times New Roman',
  fonts: [
    { src: '/fonts/times/times.ttf' }, // Regular
    { src: '/fonts/times/times.ttf', fontWeight: 700 }, // Bold
    { src: '/fonts/times/times.ttf', fontStyle: 'italic' }, // Italic
    { src: '/fonts/times/times.ttf', fontWeight: 700, fontStyle: 'italic' } // Bold Italic
  ]
});

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: '/fonts/helvetica/helvetica.ttf' }, // Regular
    { src: '/fonts/helvetica/helvetica.ttf', fontWeight: 700 }, // Bold
    { src: '/fonts/helvetica/helvetica.ttf', fontStyle: 'italic' }, // Italic
    { src: '/fonts/helvetica/helvetica.ttf', fontWeight: 700, fontStyle: 'italic' } // Bold Italic
  ]
});

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/roboto/roboto.ttf' }, // Regular
    { src: '/fonts/roboto/roboto.ttf', fontWeight: 700 }, // Bold
    { src: '/fonts/roboto/roboto.ttf', fontStyle: 'italic' }, // Italic
    { src: '/fonts/roboto/roboto.ttf', fontWeight: 700, fontStyle: 'italic' } // Bold Italic
  ]
});

Font.register({
  family: 'Montserrat',
  fonts: [
    { src: '/fonts/montserrat/montserrat.ttf' }, // Regular
    { src: '/fonts/montserrat/montserrat.ttf', fontWeight: 700 }, // Bold
    { src: '/fonts/montserrat/montserrat.ttf', fontStyle: 'italic' }, // Italic
    { src: '/fonts/montserrat/montserrat.ttf', fontWeight: 700, fontStyle: 'italic' } // Bold Italic
  ]
});

// Register fallback font that will always work
Font.register({
  family: 'Fallback',
  src: '/fonts/roboto.ttf'
});

// Helper function to get a safely available font
const getSafeFont = (requestedFont) => {
  // Extract the primary font family name
  const primaryFont = requestedFont.split(",")[0].trim();
  
  // Check if it's one of our registered fonts
  const availableFonts = ['Arial', 'Georgia', 'Times New Roman', 'Helvetica', 'Roboto', 'Montserrat'];
  
  if (availableFonts.includes(primaryFont)) {
    return primaryFont;
  }
  
  // Return fallback if requested font isn't available
  return 'Fallback';
};

// Create a component for the PDF output
export const ResumePDF = ({ resume, format, customization }) => {
  // Get safe font
  const safeFont = getSafeFont(customization.fontFamily);
  
  // Create styles based on the selected format and customization
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 0,
      fontFamily: safeFont,
      fontSize: 
        customization.fontSize === "small" ? 10 : 
        customization.fontSize === "large" ? 12 : 11,
      lineHeight: 
        customization.spacing === "compact" ? 1.3 : 
        customization.spacing === "spacious" ? 1.8 : 1.5,
    },
    header: {
      backgroundColor: customization.primaryColor || "#1a73e8",
      padding: 30,
      color: "white",
    },
    headerContent: {
      marginBottom: 5,
    },
    applicantName: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 5,
      fontFamily: safeFont,
    },
    jobPosition: {
      fontSize: 16,
      marginBottom: 15,
      fontFamily: safeFont,
    },
    contactInfo: {
      fontSize: 11,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      maxWidth: 400,
      fontFamily: safeFont,
    },
    contactItem: {
      marginRight: 15,
      marginBottom: 5,
    },
    body: {
      padding: 30,
      backgroundColor: "white",
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 8,
      color: customization.primaryColor || "#1a73e8",
      borderBottomWidth: 1,
      borderBottomColor: customization.primaryColor || "#1a73e8",
      paddingBottom: 2,
      fontFamily: safeFont,
    },
    sectionContent: {
      fontSize: 11,
      marginBottom: 10,
      fontFamily: safeFont,
    },
    experienceItem: {
      marginBottom: 10,
    },
    experienceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    companyName: {
      fontWeight: "bold",
      fontFamily: safeFont,
    },
    duration: {
      fontSize: 10,
      fontStyle: "italic",
      fontFamily: safeFont,
    },
    role: {
      fontFamily: safeFont,
      fontStyle: "italic",
      marginBottom: 4,
    },
    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    skillTag: {
      backgroundColor: customization.secondaryColor || "#f1f3f4",
      color: customization.primaryColor || "#1a73e8",
      padding: 4,
      marginRight: 5,
      marginBottom: 5,
      borderRadius: 3,
      fontSize: 10,
      fontFamily: safeFont,
    },
    languageTag: {
      backgroundColor: customization.secondaryColor || "#f1f3f4",
      color: customization.primaryColor || "#1a73e8",
      padding: 4,
      marginRight: 5,
      marginBottom: 5,
      borderRadius: 3,
      fontSize: 10,
      fontFamily: safeFont,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.applicantName}>{resume.applicantName}</Text>
            <Text style={styles.jobPosition}>{resume.jobPosition}</Text>
            
            <View style={styles.contactInfo}>
              {resume.email && (
                <Text style={styles.contactItem}>{resume.email}</Text>
              )}
              {resume.phone && (
                <Text style={styles.contactItem}>{resume.phone}</Text>
              )}
              {(resume.city || resume.state || resume.country) && (
                <Text style={styles.contactItem}>
                  {[resume.city, resume.state, resume.country]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Professional Summary */}
          {resume.professionalSummary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Summary</Text>
              <Text style={styles.sectionContent}>{resume.professionalSummary}</Text>
            </View>
          )}

          {/* Work Experience */}
          {resume.workExperiences && resume.workExperiences.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Work Experience</Text>
              {resume.workExperiences.map((experience, index) => (
                <View key={index} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.companyName}>{experience.company}</Text>
                    <Text style={styles.duration}>{experience.duration}</Text>
                  </View>
                  <Text style={styles.role}>{experience.role}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {resume.education && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              <Text style={styles.sectionContent}>{resume.education}</Text>
            </View>
          )}

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsContainer}>
                {resume.skills.map((skill, index) => (
                  <Text key={index} style={styles.skillTag}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Languages */}
          {resume.languages && resume.languages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              <View style={styles.skillsContainer}>
                {resume.languages.map((language, index) => (
                  <Text key={index} style={styles.languageTag}>
                    {language}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};