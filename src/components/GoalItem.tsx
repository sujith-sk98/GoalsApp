/**
 * GoalItem Component
 * 
 * Displays a single goal with optional completion checkbox.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Theme, Spacing, FontSize } from '../utils/theme';

export type Goal = {
  id: string;
  title: string;
  completed: boolean;
};

type GoalItemProps = {
  goal: Goal;
};

const GoalItem = ({ goal }: GoalItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[
          styles.title,
          goal.completed && styles.titleCompleted
        ]}>
          {goal.title}
        </Text>
      </View>
      {goal.completed && (
        <View style={styles.checkContainer}>
          <Icon name="check-circle" size={20} color={Theme.success} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.base,
    color: Theme.textPrimary,
    lineHeight: 22,
  },
  titleCompleted: {
    color: Theme.textTertiary,
    textDecorationLine: 'line-through',
  },
  checkContainer: {
    marginLeft: Spacing.md,
  },
});

export default GoalItem;
