/**
 * GoalItem Component
 * 
 * Displays a single goal with achievement-style UI for completed goals.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Theme, Spacing, FontSize, FontWeight, BorderRadius, Colors } from '../utils/theme';

export type Goal = {
  id: string;
  title: string;
  completed: boolean;
};

type GoalItemProps = {
  goal: Goal;
};

const GoalItem = ({ goal }: GoalItemProps) => {
  if (goal.completed) {
    // Achievement card style for completed goals
    return (
      <View style={styles.achievementCard}>
        <View style={styles.achievementBadge}>
          <Icon name="award" size={18} color={Colors.yellow600} />
        </View>
        <View style={styles.achievementContent}>
          <View style={styles.achievementHeader}>
            <Icon name="check-circle" size={12} color={Theme.success} />
            <Text style={styles.achievementLabel}>Completed</Text>
          </View>
          <Text style={styles.achievementTitle}>{goal.title}</Text>
        </View>
        <View style={styles.celebrationIcon}>
          <Icon name="star" size={16} color={Colors.yellow500} />
        </View>
      </View>
    );
  }

  // Regular card for pending goals
  return (
    <View style={styles.pendingCard}>
      <View style={styles.pendingIndicator} />
      <View style={styles.pendingContent}>
        <Text style={styles.pendingTitle}>{goal.title}</Text>
      </View>
      <View style={styles.pendingIcon}>
        <Icon name="circle" size={16} color={Theme.borderLight} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Achievement card styles (completed goals)
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.green50,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginVertical: 3,
    borderWidth: 1,
    borderColor: Colors.green100,
  },
  achievementBadge: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.yellow50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.yellow100,
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  achievementLabel: {
    fontSize: 10,
    fontWeight: FontWeight.semibold,
    color: Theme.success,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  achievementTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.green700,
    lineHeight: 18,
  },
  celebrationIcon: {
    marginLeft: Spacing.xs,
  },

  // Pending card styles (incomplete goals)
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginVertical: 3,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  pendingIndicator: {
    width: 3,
    height: 32,
    backgroundColor: Theme.primary,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  pendingContent: {
    flex: 1,
  },
  pendingTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Theme.textPrimary,
    lineHeight: 18,
  },
  pendingIcon: {
    marginLeft: Spacing.xs,
  },
});

export default GoalItem;
