/**
 * Create Goal Screen Component
 * 
 * Screen for creating new goals.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { Theme, Spacing, FontSize, FontWeight, Colors } from '../../utils/theme';

const CreateGoal = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="plus-circle" size={64} color={Theme.primary} />
        </View>
        <Text style={styles.title}>Create Goal</Text>
        <Text style={styles.subtitle}>Add new goals to track your progress</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Theme.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Theme.textTertiary,
    textAlign: 'center',
  },
});

export default CreateGoal;
