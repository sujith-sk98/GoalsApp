import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Theme, Spacing, FontSize, FontWeight, BorderRadius} from '../utils/theme';

/**
 * A tiny demo form that showcases how to build a controlled input in React Native.
 * Controlling the input lets us mirror the user's text anywhere in the UI.
 */
const DemoForm: React.FC = () => {
	// useState stores whatever the user types so we can render it elsewhere.
	const [goalText, setGoalText] = useState('');

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Demo Goal Form</Text>

			<Text style={styles.label}>Describe your goal</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your goal here"
        value={goalText}
        // TextInput provides the new string via the onChangeText callback.
        onChangeText={setGoalText}
        placeholderTextColor={Theme.inputPlaceholder}
      />			<View style={styles.previewBox}>
				<Text style={styles.previewLabel}>Live preview</Text>
				{/* Showing the text here reinforces the controlled-component pattern. */}
				<Text style={styles.previewValue}>
					{goalText.trim().length > 0 ? goalText : 'Nothing typed yet'}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    backgroundColor: Theme.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  heading: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Theme.textPrimary,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Theme.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: FontSize.base,
    backgroundColor: Theme.inputBackground,
    color: Theme.inputText,
  },
  previewBox: {
    backgroundColor: Theme.primaryLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Theme.primaryBorder,
    gap: Spacing.sm,
  },
  previewLabel: {
    fontSize: FontSize.xs,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Theme.primary,
    fontWeight: FontWeight.semibold,
  },
  previewValue: {
    fontSize: FontSize.base,
    color: Theme.textSecondary,
  },
});export default DemoForm;
