/**
 * Dashboard Screen Component
 * 
 * Main screen shown after successful login.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Theme, Spacing, FontSize, FontWeight, Colors, BorderRadius } from '../../utils/theme';
import GoalCard from '../../components/GoalCard';
import GoalDetailModal from '../../components/GoalDetailModal';
import GroupSelector from '../../components/GroupSelector';
import AddGoalForm from '../../components/AddGoalForm';
import ConfirmDialog from '../../components/ConfirmDialog';
import SwipeableTaskItem from '../../components/SwipeableTaskItem';
import { Goal } from '../../components/GoalItem';
import { GoalPeriodCard, GoalGroup, type Friend } from '../../types/storage.types';
import { useGoals } from '../../hooks/useGoals';
import { useAutoReset } from '../../hooks/useAutoReset';
import { initializeAppData } from '../../storage/SeedData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;

const Dashboard = () => {
  const isFocused = useIsFocused();
  const flatListRef = useRef<FlatList>(null);
  
  // Use the storage-backed hooks
  const { groups, friends, loading, refresh, deleteGroup: removeGroup, addGoal, toggleGoal: toggleGoalStorage, removeFriendFromGroup: removeFriendFromGroupStorage } = useGoals();
  
  // Initialize app data and auto-reset on mount and app state changes
  useAutoReset({
    onResetComplete: () => {
      console.log('✅ Goals have been reset');
      refresh(); // Refresh data after reset
    },
  });
  
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<GoalPeriodCard | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showRemoveFriendDialog, setShowRemoveFriendDialog] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState<Friend | null>(null);
  const [taskFilters, setTaskFilters] = useState<Set<'daily' | 'weekly' | 'monthly'>>(new Set());

  // Initialize app data on first mount
  useEffect(() => {
    const init = async () => {
      await initializeAppData();
      await refresh();
    };
    init();
  }, []);

  // Create virtual "ALL" group that aggregates all groups
  const createAllGroup = useMemo((): GoalGroup => {
    const allDailyGoals: Goal[] = [];
    const allWeeklyGoals: Goal[] = [];
    const allMonthlyGoals: Goal[] = [];
    const allFriendIds = new Set<string>();
    const now = new Date().toISOString();

    groups.forEach(group => {
      group.friendIds.forEach(id => allFriendIds.add(id));
      
      const dailyCard = group.cards.find(c => c.period === 'daily');
      const weeklyCard = group.cards.find(c => c.period === 'weekly');
      const monthlyCard = group.cards.find(c => c.period === 'monthly');

      if (dailyCard) allDailyGoals.push(...dailyCard.goals);
      if (weeklyCard) allWeeklyGoals.push(...weeklyCard.goals);
      if (monthlyCard) allMonthlyGoals.push(...monthlyCard.goals);
    });

    return {
      id: 'all',
      name: 'All Groups',
      color: Theme.accent,
      friendIds: Array.from(allFriendIds),
      createdAt: now,
      updatedAt: now,
      cards: [
        {
          id: 'all-daily',
          period: 'daily',
          title: 'Daily Goals (All)',
          color: Theme.accent,
          goals: allDailyGoals,
        },
        {
          id: 'all-weekly',
          period: 'weekly',
          title: 'Weekly Goals (All)',
          color: Theme.accent,
          goals: allWeeklyGoals,
        },
        {
          id: 'all-monthly',
          period: 'monthly',
          title: 'Monthly Goals (All)',
          color: Theme.accent,
          goals: allMonthlyGoals,
        },
      ],
    };
  }, [groups]);

  // Get the current selected group based on selectedGroupId
  const selectedGroup = useMemo(() => {
    if (!selectedGroupId) return null;
    if (selectedGroupId === 'all') return createAllGroup;
    return groups.find(g => g.id === selectedGroupId) || null;
  }, [selectedGroupId, groups, createAllGroup]);

  // Set initial selected group when groups load
  useEffect(() => {
    if (groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  // Refresh when screen comes into focus
  useEffect(() => {
    if (isFocused) {
      refresh();
    }
  }, [isFocused]);

  const handleCardPress = (card: GoalPeriodCard) => {
    setSelectedCard(card);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedCard(null), 300);
  };

  const handleDeleteGroup = async (groupId: string) => {
    const success = await removeGroup(groupId);
    if (success) {
      // If deleted group was selected, select the first available group
      if (selectedGroupId === groupId) {
        if (groups.length > 1) {
          // Find first group that isn't the deleted one
          const nextGroup = groups.find(g => g.id !== groupId);
          setSelectedGroupId(nextGroup?.id || null);
        } else {
          setSelectedGroupId(null);
        }
      }
      // No need to refresh - deleteGroup already updates local state
    }
  };

  const handleGoalSubmit = async (goalData: { 
    title: string; 
    frequency: 'daily' | 'weekly' | 'monthly'; 
    groupId: string;
  }) => {
    const newGoal = await addGoal(goalData.groupId, goalData.frequency, goalData.title);
    if (newGoal) {
      console.log('New goal created:', newGoal);
    }
    // The addGoal function already updates the local state, no need to refresh
  };

  const handleToggleGoal = async (goalId: string, cardId: string) => {
    if (!selectedGroup) return;
    
    // If we're in "All" view, we need to find which group this goal belongs to
    let targetGroupId = selectedGroup.id;
    
    if (selectedGroup.id === 'all') {
      // Find the actual group that contains this goal
      for (const group of groups) {
        const card = group.cards.find(c => c.id === cardId);
        if (card) {
          const hasGoal = card.goals.some(g => g.id === goalId);
          if (hasGoal) {
            targetGroupId = group.id;
            break;
          }
        }
      }
    }
    
    // Toggle the goal - this will update storage and the hook will automatically
    // update the state without a full refresh
    try {
      await toggleGoalStorage(targetGroupId, cardId, goalId);
    } catch (error) {
      console.error('Error toggling goal:', error);
    }
  };

  const getPendingGoals = useMemo((): Array<{ goal: Goal; cardTitle: string; cardId: string; frequency: 'daily' | 'weekly' | 'monthly' }> => {
    if (!selectedGroup) return [];
    
    const pending: Array<{ goal: Goal; cardTitle: string; cardId: string; frequency: 'daily' | 'weekly' | 'monthly' }> = [];
    selectedGroup.cards.forEach(card => {
      // Determine frequency from card title
      let frequency: 'daily' | 'weekly' | 'monthly' = 'daily';
      if (card.title.toLowerCase().includes('weekly')) {
        frequency = 'weekly';
      } else if (card.title.toLowerCase().includes('monthly')) {
        frequency = 'monthly';
      }

      card.goals.forEach(goal => {
        if (!goal.completed) {
          pending.push({ goal, cardTitle: card.title, cardId: card.id, frequency });
        }
      });
    });

    // Apply filters if any are selected
    if (taskFilters.size > 0) {
      return pending.filter(item => taskFilters.has(item.frequency));
    }

    return pending;
  }, [selectedGroup, taskFilters]);

  const getTotalGoalsCount = (): number => {
    if (!selectedGroup) return 0;
    return selectedGroup.cards.reduce((total, card) => total + card.goals.length, 0);
  };

  const hasAnyGoals = getTotalGoalsCount() > 0;

  const toggleTaskFilter = (filter: 'daily' | 'weekly' | 'monthly') => {
    const newFilters = new Set(taskFilters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    setTaskFilters(newFilters);
  };

  const getGroupFriends = (): Friend[] => {
    if (!selectedGroup) return [];
    
    return friends.filter(friend => selectedGroup.friendIds.includes(friend.id));
  };

  const handleRemoveFriend = (friend: Friend) => {
    // Can't remove friends from ALL group
    if (!selectedGroup || selectedGroup.id === 'all') {
      return;
    }
    setFriendToRemove(friend);
    setShowRemoveFriendDialog(true);
  };

  const confirmRemoveFriend = async () => {
    if (friendToRemove && selectedGroup && selectedGroup.id !== 'all') {
      const success = await removeFriendFromGroupStorage(selectedGroup.id, friendToRemove.id);
      // No need to refresh - removeFriendFromGroup already updates local state
    }
    setShowRemoveFriendDialog(false);
    setFriendToRemove(null);
  };

  const getInitials = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  const handleScroll = (event: any) => {
    const slideSize = CARD_WIDTH + Spacing.lg;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideSize);
    setActiveIndex(index);
  };

  const renderGoalCard = ({ item }: { item: GoalPeriodCard }) => (
    <View style={styles.cardContainer}>
      <GoalCard group={item} onPress={() => handleCardPress(item)} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'top']}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.primary} />
          <Text style={styles.loadingText}>Loading your goals...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header with Greeting and Group Selector */}
          <View style={styles.header}>
            <View style={styles.greetingSection}>
              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.name}>Sujith!</Text>
            </View>
            {selectedGroup && (
              <GroupSelector
                groups={groups}
                selectedGroup={selectedGroup}
                onSelectGroup={(group) => {
                  setSelectedGroupId(group.id);
                }}
                onDeleteGroup={handleDeleteGroup}
                showAllOption={true}
              />
            )}
          </View>

          {selectedGroup && (
            <>
              {/* Goal Cards Carousel */}
              <View style={styles.carouselSection}>
                <FlatList
                  ref={flatListRef}
                  data={selectedGroup.cards}
                  renderItem={renderGoalCard}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={CARD_WIDTH + Spacing.lg}
                  decelerationRate="fast"
                  contentContainerStyle={styles.carouselContent}
                  pagingEnabled={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                />
              </View>

              {/* Pagination Dots */}
              <View style={styles.paginationContainer}>
                <View style={styles.paginationDots}>
                  {selectedGroup.cards.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        index === activeIndex ? styles.activeDot : styles.inactiveDot,
                      ]}
                    />
                  ))}
                </View>
              </View>
            </>
          )}

        {/* Empty State - Show when no goals exist */}
        {!hasAnyGoals && selectedGroup && (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIconContainer}>
              <Icon name="target" size={64} color={Theme.primary} style={styles.emptyStateIcon} />
              <View style={styles.emptyStateBadge}>
                <Icon name="plus" size={20} color={Colors.white} />
              </View>
            </View>
            <Text style={styles.emptyStateTitle}>No Goals Yet!</Text>
            <Text style={styles.emptyStateSubtitle}>
              Start your journey by creating your first goal.{'\n'}
            </Text>
            <View style={styles.emptyStateFeatures}>
              <View style={styles.emptyStateFeature}>
                <Icon name="check-circle" size={20} color={Theme.primary} />
                <Text style={styles.emptyStateFeatureText}>Track your progress</Text>
              </View>
              <View style={styles.emptyStateFeature}>
                <Icon name="calendar" size={20} color={Theme.primary} />
                <Text style={styles.emptyStateFeatureText}>Set flexible schedules</Text>
              </View>
              <View style={styles.emptyStateFeature}>
                <Icon name="trending-up" size={20} color={Theme.primary} />
                <Text style={styles.emptyStateFeatureText}>Build better habits</Text>
              </View>
            </View>
          </View>
        )}

        {/* Create New Goal Button */}
        <View style={styles.addGoalSection}>
          <TouchableOpacity
            style={styles.addGoalButton}
            onPress={() => setShowAddGoalForm(true)}
            activeOpacity={0.8}
          >
            <View style={styles.addGoalButtonContent}>
              <View style={styles.addGoalIconContainer}>
                <Icon name="plus" size={20} color={Colors.white} />
              </View>
              <Text style={styles.addGoalButtonText}>Create New Goal </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Pending Tasks Section */}
        {hasAnyGoals && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="list" size={20} color={Theme.primary} />
              <Text style={styles.sectionTitle}>Pending Tasks</Text>
              {getPendingGoals.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{getPendingGoals.length}</Text>
                </View>
              )}
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  taskFilters.has('daily') && styles.filterButtonActive
                ]}
                onPress={() => toggleTaskFilter('daily')}
                activeOpacity={0.7}
              >
                <Icon 
                  name="sun" 
                  size={14} 
                  color={taskFilters.has('daily') ? Colors.white : Theme.primary} 
                />
                <Text style={[
                  styles.filterButtonText,
                  taskFilters.has('daily') && styles.filterButtonTextActive
                ]}>
                  Daily
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  taskFilters.has('weekly') && styles.filterButtonActive
                ]}
                onPress={() => toggleTaskFilter('weekly')}
                activeOpacity={0.7}
              >
                <Icon 
                  name="calendar" 
                  size={14} 
                  color={taskFilters.has('weekly') ? Colors.white : Theme.primary} 
                />
                <Text style={[
                  styles.filterButtonText,
                  taskFilters.has('weekly') && styles.filterButtonTextActive
                ]}>
                  Weekly
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  taskFilters.has('monthly') && styles.filterButtonActive
                ]}
                onPress={() => toggleTaskFilter('monthly')}
                activeOpacity={0.7}
              >
                <Icon 
                  name="clock" 
                  size={14} 
                  color={taskFilters.has('monthly') ? Colors.white : Theme.primary} 
                />
                <Text style={[
                  styles.filterButtonText,
                  taskFilters.has('monthly') && styles.filterButtonTextActive
                ]}>
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>

            {getPendingGoals.length > 0 ? (
              <>
                <Text style={styles.swipeHint}>
                  <Icon name="chevrons-right" size={12} color={Theme.textTertiary} /> Swipe right to complete
                </Text>
                <View style={styles.tasksList}>
                  {getPendingGoals.map(({ goal, cardTitle, cardId }) => (
                    <SwipeableTaskItem
                      key={goal.id}
                      goal={goal}
                      cardTitle={cardTitle}
                      onComplete={() => handleToggleGoal(goal.id, cardId)}
                    />
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.noTasksContainer}>
                <Icon name="check-circle" size={32} color={Theme.success} />
                <Text style={styles.noTasksText}>
                  {taskFilters.size > 0 
                    ? 'No pending Goals for selected filters' 
                    : 'All Goals completed!'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Friends Section */}
        {getGroupFriends().length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="users" size={20} color={Theme.primary} />
              <Text style={styles.sectionTitle}>Group Members</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{getGroupFriends().length}</Text>
              </View>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.friendsListContent}
            >
              {getGroupFriends().map((friend) => (
                <View key={friend.id} style={styles.friendItem}>
                  <View style={styles.friendAvatarContainer}>
                    <View style={[styles.friendAvatar, { backgroundColor: Theme.primary }]}>
                      <Text style={styles.friendInitial}>{getInitials(friend.name)}</Text>
                    </View>
                    {selectedGroup && selectedGroup.id !== 'all' && (
                      <TouchableOpacity
                        style={styles.removeFriendButton}
                        onPress={() => handleRemoveFriend(friend)}
                        activeOpacity={0.7}
                      >
                        <Icon name="x" size={12} color={Colors.white} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.friendName} numberOfLines={1}>
                    {friend.name.split(' ')[0]}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
      )}

      {/* Goal Detail Modal */}
      <GoalDetailModal
        visible={modalVisible}
        group={selectedCard}
        onClose={handleCloseModal}
      />

      {/* Add Goal Form Modal */}
      <AddGoalForm
        visible={showAddGoalForm}
        onClose={() => setShowAddGoalForm(false)}
        onSubmit={handleGoalSubmit}
        defaultGroup={selectedGroup && selectedGroup.id !== 'all' ? selectedGroup : undefined}
      />

      {/* Remove Friend Confirmation */}
      <ConfirmDialog
        visible={showRemoveFriendDialog}
        title="Remove Friend"
        message={`Are you sure you want to remove ${friendToRemove?.name} from this group?`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemoveFriend}
        onCancel={() => {
          setShowRemoveFriendDialog(false);
          setFriendToRemove(null);
        }}
        destructive={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  loadingText: {
    fontSize: FontSize.lg,
    color: Theme.textSecondary,
    marginTop: Spacing.md,
  },
  scrollContent: {
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl,
    paddingTop: 0,
    paddingBottom: Spacing.md,
  },
  greetingSection: {
    flex: 1,
    marginRight: Spacing.md,
  },
  greeting: {
    fontSize: FontSize.base,
    color: Theme.textTertiary,
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: FontSize.xxxl + 4,
    fontWeight: FontWeight.bold,
    color: Theme.textPrimary,
  },
  carouselSection: {
    paddingTop: Spacing.sm,
  },
  carouselContent: {
    paddingLeft: Spacing.xl,
    paddingRight: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: Spacing.lg,
  },
  paginationContainer: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    borderBottomColor: Theme.borderLight,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Theme.primary,
    width: 24,
    borderRadius: 4,
  },
  inactiveDot: {
    backgroundColor: Theme.borderLight,
  },
  addGoalSection: {
    paddingHorizontal: Spacing.md,
  },
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.buttonPrimary,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    shadowColor: Theme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: Spacing.xxl,
    height: 56,
  },
  addGoalButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addGoalIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addGoalButtonText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Theme.textInverse,
    fontFamily: 'Caveat-Bold'
  },
  bottomSpacer: {
    height: Spacing.xl * 2,
  },
  // Pending Tasks Section
  section: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Theme.textPrimary,
    flex: 1,
  },
  badge: {
    backgroundColor: Theme.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Theme.badgeText,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Theme.primary,
    backgroundColor: Theme.background,
  },
  filterButtonActive: {
    backgroundColor: Theme.primary,
  },
  filterButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Theme.primary,
  },
  filterButtonTextActive: {
    color: Theme.textInverse,
  },
  swipeHint: {
    fontSize: FontSize.xs,
    color: Theme.textTertiary,
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
  },
  tasksList: {
    gap: Spacing.xs,
  },
  // Friends Section
  friendsListContent: {
    gap: Spacing.lg,
    paddingRight: Spacing.xl,
  },
  friendItem: {
    alignItems: 'center',
    width: 70,
    marginTop: Spacing.sm,
  },
  friendAvatarContainer: {
    position: 'relative',
    marginBottom: Spacing.xs,
  },
  friendAvatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Theme.background,
    shadowColor: Theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendInitial: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Theme.textInverse,
  },
  removeFriendButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    backgroundColor: Theme.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.background,
  },
  friendName: {
    fontSize: FontSize.sm,
    color: Theme.textSecondary,
    textAlign: 'center',
    fontWeight: FontWeight.medium,
  },
  // Empty State Styles
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl ,
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.md,
    backgroundColor: Theme.background,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Theme.borderLight,
    borderStyle: 'dashed',
  },
  emptyStateIconContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  emptyStateIcon: {
    opacity: 0.3,
  },
  emptyStateBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Theme.background,
    shadowColor: Theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Theme.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: FontSize.base,
    color: Theme.textTertiary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  emptyStateFeatures: {
    width: '100%',
    gap: Spacing.md,
  },
  emptyStateFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  emptyStateFeatureText: {
    fontSize: FontSize.base,
    color: Theme.textSecondary,
    fontWeight: FontWeight.medium,
  },
  noTasksContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  noTasksText: {
    fontSize: FontSize.base,
    color: Theme.textSecondary,
    textAlign: 'center',
    fontWeight: FontWeight.medium,
  },
});

export default Dashboard;
