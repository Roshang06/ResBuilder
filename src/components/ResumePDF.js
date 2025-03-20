import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
    family: 'Arial',
    src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf',
  });
  
  Font.register({
    family: 'Helvetica',
    src: 'https://fonts.gstatic.com/s/montserrat/v14/JTUSjIg1_i6t8kCHKm459Wlhzg.ttf',
  });
  
  Font.register({
    family: 'Georgia',
    src: 'https://fonts.gstatic.com/s/merriweather/v21/u-4n0qyriQwlOrhSvowK_l52_wFpXw.ttf',
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