/**
 * GoalDetailModal Component
 * 
 * Modal that displays all goals in a period (daily/weekly/monthly) with ability to close.
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Theme, Spacing, FontSize, FontWeight, BorderRadius, Colors } from '../utils/theme';
import GoalItem from './GoalItem';
import { GoalPeriodCard } from '../types/storage.types';

type GoalDetailModalProps = {
  visible: boolean;
  group: GoalPeriodCard | null;
  onClose: () => void;
};

const GoalDetailModal = ({ visible, group, onClose }: GoalDetailModalProps) => {
  if (!group) return null;

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

  const completedCount = group.goals.filter(g => g.completed).length;
  const totalCount = group.goals.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Separate completed and pending goals
  const completedGoals = group.goals.filter(g => g.completed);
  const pendingGoals = group.goals.filter(g => !g.completed);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBadge, { backgroundColor: group.color || Theme.primary }]}>
                <Icon name={getIcon()} size={24} color={Theme.textInverse} />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>{group.title}</Text>
                <Text style={styles.subtitle}>
                  {completedCount} of {totalCount} completed
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="x" size={24} color={Theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
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
            <Text style={styles.progressText}>{Math.round(progressPercentage)}%</Text>
          </View>

          {/* Goal List */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Pending Goals Section */}
            {pendingGoals.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Icon name="target" size={16} color={Theme.primary} />
                  <Text style={styles.sectionTitle}>In Progress</Text>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>{pendingGoals.length}</Text>
                  </View>
                </View>
                {pendingGoals.map((goal) => (
                  <GoalItem key={goal.id} goal={goal} />
                ))}
              </View>
            )}

            {/* Completed Goals Section */}
            {completedGoals.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Icon name="award" size={16} color={Theme.success} />
                  <Text style={[styles.sectionTitle, styles.sectionTitleCompleted]}>Achievements</Text>
                  <View style={[styles.sectionBadge, styles.sectionBadgeCompleted]}>
                    <Text style={styles.sectionBadgeText}>{completedGoals.length}</Text>
                  </View>
                </View>
                {completedGoals.map((goal) => (
                  <GoalItem key={goal.id} goal={goal} />
                ))}
              </View>
            )}

            {/* Empty State */}
            {totalCount === 0 && (
              <View style={styles.emptyState}>
                <Icon name="inbox" size={48} color={Theme.textTertiary} />
                <Text style={styles.emptyStateText}>No goals yet</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Theme.background,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    height: '85%',
    paddingBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Theme.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Theme.textTertiary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Theme.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
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
    minWidth: 35,
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Theme.textSecondary,
    flex: 1,
  },
  sectionTitleCompleted: {
    color: Theme.success,
  },
  sectionBadge: {
    backgroundColor: Theme.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionBadgeCompleted: {
    backgroundColor: Theme.success,
  },
  sectionBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyStateText: {
    fontSize: FontSize.sm,
    color: Theme.textTertiary,
    marginTop: Spacing.sm,
  },
});

export default GoalDetailModal;
