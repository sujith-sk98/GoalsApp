/**
 * GoalCard Component
 * 
 * A modern compact card displaying a goal period (daily/weekly/monthly).
 * Taps to open detailed modal view.
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Theme, Spacing, FontSize, FontWeight, BorderRadius, getShadow, Colors } from '../utils/theme';
import { GoalPeriodCard } from '../constants/constants';

type GoalCardProps = {
  group: GoalPeriodCard;
  onPress: () => void;
};

const GoalCard = ({ group, onPress }: GoalCardProps) => {
  const completedCount = group.goals.filter(g => g.completed).length;
  const totalCount = group.goals.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  // Icon based on period
  const getIcon = () => {
    switch (group.period) {
      case 'daily':
        return 'sun';
      case 'weekly':
        return 'calendar';
      case 'monthly':
        return 'trending-up';
      default:
        return 'target';
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Color Accent Bar */}
      <View style={[styles.accentBar, { backgroundColor: group.color || Theme.primary }]} />

      {/* Card Content */}
      <View style={styles.content}>
        {/* Header with Icon */}
        <View style={styles.header}>
          <View style={[styles.iconBadge, { backgroundColor: group.color || Theme.primary }]}>
            <Icon name={getIcon()} size={20} color={Theme.textInverse} />
          </View>
          <View style={styles.chevron}>
            <Icon name="chevron-right" size={20} color={Theme.textTertiary} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>{group.title}</Text>

        {/* Progress Info */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: group.color || Theme.primary,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {completedCount}/{totalCount}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Icon name="check-circle" size={14} color={Theme.success} />
            <Text style={styles.statText}>{completedCount} done</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="circle" size={14} color={Theme.textTertiary} />
            <Text style={styles.statText}>{totalCount - completedCount} left</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EFF7F6', // Pale mint background for cards
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    ...getShadow(3),
    height: 180,
  },
  accentBar: {
    height: 4,
    width: '100%',
  },
  content: {
    padding: Spacing.lg,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Theme.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Theme.textPrimary,
    marginBottom: Spacing.md,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Theme.backgroundSecondary,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginRight: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Theme.textSecondary,
    minWidth: 32,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    fontSize: FontSize.xs,
    color: Theme.textTertiary,
  },
});

export default GoalCard;
