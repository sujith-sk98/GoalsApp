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
import { GoalPeriodCard } from '../constants/constants';

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
  const progressPercentage = (completedCount / totalCount) * 100;

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
            {group.goals.map((goal) => (
              <GoalItem key={goal.id} goal={goal} />
            ))}
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
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Theme.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Theme.textTertiary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Theme.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Theme.backgroundSecondary,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Theme.textSecondary,
    minWidth: 40,
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
});

export default GoalDetailModal;
