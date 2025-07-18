import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { COLORS } from '../constants/colors';

const FAQS = [
  { 
    question: 'How does the matchmaking algorithm work?',
    answer: 'Our AI-powered algorithm considers your preferences, interests, background, and behavior on the app to suggest the most compatible matches for you.'
  },
  { 
    question: 'Is my personal information secure?',
    answer: 'Yes, we use bank-grade encryption to protect your data. We never share your contact information with anyone without your explicit permission.'
  },
  { 
    question: 'Can I hide my profile temporarily?',
    answer: 'Yes, you can pause your profile visibility at any time from your account settings while still being able to browse other profiles.'
  },
  { 
    question: 'How do I verify my profile?',
    answer: 'You can verify your profile by uploading a government ID and taking a selfie for our verification team to review.'
  },
  { 
    question: 'What is included in the free plan?',
    answer: 'The free plan includes basic profile creation, limited daily matches, and the ability to express interest. Premium features require a subscription.'
  }
];

const FAQSection = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };
  return (
    <MotiView 
      style={styles.section}
      from={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 800 }}
    >
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      {FAQS.map((faq, index) => (
        <MotiView 
          key={index}
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: index * 100 }}
        >
          <TouchableOpacity 
            style={styles.faqItem}
            onPress={() => toggleFaq(index)}
          >
            <View style={styles.faqQuestion}>
              <Text style={styles.faqQuestionText}>{faq.question}</Text>
              <MotiView
                animate={{ rotate: expandedFaq === index ? '180deg' : '0deg' }}
                transition={{ type: 'timing', duration: 300 }}
              >
                <Text style={styles.faqToggle}>{expandedFaq === index ? '−' : '+'}</Text>
              </MotiView>
            </View>
            {expandedFaq === index && (
              <MotiView
                from={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ type: 'timing', duration: 400 }}
              >
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </MotiView>
            )}
          </TouchableOpacity>
        </MotiView>
      ))}
    </MotiView>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  faqItem: {
    backgroundColor: COLORS.neutral,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
    flex: 1,
  },
  faqToggle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  faqAnswer: {
    fontSize: 14,
    color: COLORS.secondary,
    marginTop: 10,
    lineHeight: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});

export default FAQSection; 