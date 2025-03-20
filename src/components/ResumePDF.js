import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register all font variants
Font.register({
    family: 'Arial',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf' }, // Regular
      { src: 'https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmWUlfBBc9.ttf', fontWeight: 700 }, // Bold
      { src: 'https://fonts.gstatic.com/s/roboto/v27/KFOkCnqEu92Fr1Mu51xIIzg.ttf', fontStyle: 'italic' }, // Italic
      { src: 'https://fonts.gstatic.com/s/roboto/v27/KFOjCnqEu92Fr1Mu51TzBic6CsE.ttf', fontWeight: 700, fontStyle: 'italic' } // Bold Italic
    ]
  });
  
  // Georgia
  Font.register({
    family: 'Georgia',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/librebaskerville/v9/kmKnZrc3Hgbbcjq75U4uslyuy4kn0qNZaxM.ttf' }, // Regular
      { src: 'https://fonts.gstatic.com/s/librebaskerville/v9/kmKiZrc3Hgbbcjq75U4uslyuy4kn0qviTgY3KcU.ttf', fontWeight: 700 }, // Bold
      { src: 'https://fonts.gstatic.com/s/librebaskerville/v9/kmKhZrc3Hgbbcjq75U4uslyuy4kn0qNcWx8QCQ.ttf', fontStyle: 'italic' }, // Italic
    ]
  });
  
  // Times New Roman (using a similar serif font)
  Font.register({
    family: 'Times New Roman',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/ptserif/v12/EJRVQgYoZZY2vCFuvAFWzro.ttf' }, // Regular
      { src: 'https://fonts.gstatic.com/s/ptserif/v12/EJRSQgYoZZY2vCFuvAnt66qSVy8.ttf', fontWeight: 700 }, // Bold
      { src: 'https://fonts.gstatic.com/s/ptserif/v12/EJRTQgYoZZY2vCFuvAFT_rm1cgT9rQ.ttf', fontStyle: 'italic' }, // Italic
      { src: 'https://fonts.gstatic.com/s/ptserif/v12/EJRQQgYoZZY2vCFuvAFT9gaQZynfpFA.ttf', fontWeight: 700, fontStyle: 'italic' } // Bold Italic
    ]
  });
  
  // Helvetica (using a similar sans-serif font)
  Font.register({
    family: 'Helvetica',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf' }, // Regular
      { src: 'https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN7rgOUuhs.ttf', fontWeight: 700 }, // Bold
      { src: 'https://fonts.gstatic.com/s/opensans/v18/mem6YaGs126MiZpBA-UFUK0Zdcg.ttf', fontStyle: 'italic' }, // Italic
      { src: 'https://fonts.gstatic.com/s/opensans/v18/memnYaGs126MiZpBA-UFUKWiUNhrIqY.ttf', fontWeight: 700, fontStyle: 'italic' } // Bold Italic
    ]
  });
  
  // Roboto
  Font.register({
    family: 'Roboto',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf' }, // Regular
      { src: 'https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmWUlfBBc9.ttf', fontWeight: 700 }, // Bold
      { src: 'https://fonts.gstatic.com/s/roboto/v27/KFOkCnqEu92Fr1Mu51xIIzg.ttf', fontStyle: 'italic' }, // Italic
      { src: 'https://fonts.gstatic.com/s/roboto/v27/KFOjCnqEu92Fr1Mu51TzBic6CsE.ttf', fontWeight: 700, fontStyle: 'italic' } // Bold Italic
    ]
  });
  
  // Montserrat
  Font.register({
    family: 'Montserrat',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459Wlhzg.ttf' }, // Regular
      { src: 'https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_dJE3gnD-w.ttf', fontWeight: 700 }, // Bold
      { src: 'https://fonts.gstatic.com/s/montserrat/v15/JTUPjIg1_i6t8kCHKm459WxZcgvz8fZwnCo.ttf', fontStyle: 'italic' }, // Italic
      { src: 'https://fonts.gstatic.com/s/montserrat/v15/JTUPjIg1_i6t8kCHKm459WxZcgvz_PZ1.ttf', fontWeight: 700, fontStyle: 'italic' } // Bold Italic
    ]
  });

// Create a component for the PDF output
export const ResumePDF = ({ resume, format, customization }) => {
  // Create styles based on the selected format and customization
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 0,
      fontFamily: customization.fontFamily.split(",")[0].trim(),
      fontSize: 
        customization.fontSize === "small" ? 10 : 
        customization.fontSize === "large" ? 12 : 11,
      lineHeight: 
        customization.spacing === "compact" ? 1.3 : 
        customization.spacing === "spacious" ? 1.8 : 1.5,
    },
    header: {
      backgroundColor: customization.primaryColor,
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
    },
    jobPosition: {
      fontSize: 16,
      marginBottom: 15,
    },
    contactInfo: {
      fontSize: 11,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      maxWidth: 400,
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
      color: customization.primaryColor,
      borderBottomWidth: 1,
      borderBottomColor: customization.primaryColor,
      paddingBottom: 2,
    },
    sectionContent: {
      fontSize: 11,
      marginBottom: 10,
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
    },
    duration: {
      fontSize: 10,
      fontStyle: "italic",
    },
    role: {
      fontFamily: customization.fontFamily.split(",")[0].trim(),
      fontStyle: "italic",
      marginBottom: 4,
    },
    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    skillTag: {
      backgroundColor: customization.secondaryColor,
      color: customization.primaryColor,
      padding: 4,
      marginRight: 5,
      marginBottom: 5,
      borderRadius: 3,
      fontSize: 10,
    },
    languageTag: {
      backgroundColor: customization.secondaryColor,
      color: customization.primaryColor,
      padding: 4,
      marginRight: 5,
      marginBottom: 5,
      borderRadius: 3,
      fontSize: 10,
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