import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import { Svg, Path } from 'react-native-svg';
import { motifySvg } from 'moti/svg';

const MotiPath = motifySvg(Path)();

const AnimatedSubmitButton = ({ isSubmitting, onPress }) => {
  return (
    <Pressable onPress={onPress} disabled={isSubmitting}>
      <MotiView
        style={styles.container}
        animate={{
          width: isSubmitting ? 50 : 250,
          height: 50,
          borderRadius: isSubmitting ? 25 : 12,
          backgroundColor: isSubmitting ? '#71DFBE' : '#FF6F61',
        }}
        transition={{
          type: 'timing',
          duration: 300,
        }}
      >
        <AnimatePresence>
          {!isSubmitting && (
            <MotiText
              style={styles.text}
              from={{ opacity: 1, translateY: 0 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -10 }}
              transition={{ type: 'timing', duration: 150 }}
            >
              Submit Story
            </MotiText>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSubmitting && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 300, delay: 300 }}
              style={styles.svgContainer}
            >
              <Svg viewBox="0 0 25 30" style={styles.checkmarkSvg}>
                <MotiPath
                  d="M2,19.2C5.9,23.6,9.4,28,9.4,28L23,2"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  from={{ strokeDashoffset: 40.8 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{
                    type: 'timing',
                    duration: 300,
                    delay: 500,
                  }}
                />
              </Svg>
            </MotiView>
          )}
        </AnimatePresence>
      </MotiView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignSelf: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
  },
  svgContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkSvg: {
    width: 25,
    height: 30,
  },
});

export default AnimatedSubmitButton;  