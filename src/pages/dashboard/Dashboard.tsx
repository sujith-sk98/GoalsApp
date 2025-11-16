/**
 * Dashboard Screen Component
 * 
 * Main screen shown after successful login.
 */

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
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
import { MOCK_GOAL_GROUPS, MOCK_FRIENDS, USER_INFO, GoalPeriodCard, GoalGroup, deleteGroup, addNewGoal, type Friend } from '../../constants/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;

const Dashboard = () => {
  const isFocused = useIsFocused();
  const flatListRef = useRef<FlatList>(null);
  const [groups, setGroups] = useState<GoalGroup[]>(MOCK_GOAL_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<GoalGroup>(MOCK_GOAL_GROUPS[0]);
  const [selectedCard, setSelectedCard] = useState<GoalPeriodCard | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showRemoveFriendDialog, setShowRemoveFriendDialog] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState<Friend | null>(null);
  const [taskFilters, setTaskFilters] = useState<Set<'daily' | 'weekly' | 'monthly'>>(new Set());

  // Refresh groups when screen comes into focus
  useEffect(() => {
    if (isFocused) {
      setGroups([...MOCK_GOAL_GROUPS]);
      // Update selected group if it still exists
      const updatedGroup = MOCK_GOAL_GROUPS.find(g => g.id === selectedGroup.id);
      if (updatedGroup) {
        setSelectedGroup(updatedGroup);
      } else if (MOCK_GOAL_GROUPS.length > 0) {
        setSelectedGroup(MOCK_GOAL_GROUPS[0]);
      }
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

  const handleDeleteGroup = (groupId: string) => {
    const success = deleteGroup(groupId);
    if (success) {
      // Update local state
      const updatedGroups = MOCK_GOAL_GROUPS;
      setGroups([...updatedGroups]);
      
      // If deleted group was selected, select the first available group
      if (selectedGroup.id === groupId && updatedGroups.length > 0) {
        setSelectedGroup(updatedGroups[0]);
      }
    }
  };

  const handleGoalSubmit = (goalData: { 
    title: string; 
    frequency: 'daily' | 'weekly' | 'monthly'; 
    groupId: string;
  }) => {
    const newGoal = addNewGoal(goalData.title, goalData.frequency, goalData.groupId);
    console.log('New goal created:', newGoal);
    
    // Update local state
    setGroups([...MOCK_GOAL_GROUPS]);
    
    // Update selected group to the one where goal was added
    const updatedGroup = MOCK_GOAL_GROUPS.find(g => g.id === goalData.groupId);
    if (updatedGroup) {
      setSelectedGroup(updatedGroup);
    }
  };

  const handleToggleGoal = (goalId: string, cardId: string) => {
    const card = selectedGroup.cards.find(c => c.id === cardId);
    if (card) {
      const goal = card.goals.find(g => g.id === goalId);
      if (goal) {
        goal.completed = !goal.completed;
        setGroups([...MOCK_GOAL_GROUPS]);
      }
    }
  };

  const getPendingGoals = (): Array<{ goal: Goal; cardTitle: string; cardId: string; frequency: 'daily' | 'weekly' | 'monthly' }> => {
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
  };

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
    return MOCK_FRIENDS.filter(friend => selectedGroup.friendIds.includes(friend.id));
  };

  const handleRemoveFriend = (friend: Friend) => {
    setFriendToRemove(friend);
    setShowRemoveFriendDialog(true);
  };

  const confirmRemoveFriend = () => {
    if (friendToRemove) {
      const index = selectedGroup.friendIds.indexOf(friendToRemove.id);
      if (index > -1) {
        selectedGroup.friendIds.splice(index, 1);
        setGroups([...MOCK_GOAL_GROUPS]);
      }
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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Greeting and Group Selector */}
        <View style={styles.header}>
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>{USER_INFO.greeting}</Text>
            <Text style={styles.name}>{USER_INFO.name}!</Text>
          </View>
          <GroupSelector
            groups={groups}
            selectedGroup={selectedGroup}
            onSelectGroup={setSelectedGroup}
            onDeleteGroup={handleDeleteGroup}
          />
        </View>

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
              <Text style={styles.addGoalButtonText}>Create New Goal</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Pending Tasks Section */}
        {getPendingGoals().length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="list" size={20} color={Theme.primary} />
              <Text style={styles.sectionTitle}>Pending Tasks</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{getPendingGoals().length}</Text>
              </View>
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

            <Text style={styles.swipeHint}>
              <Icon name="chevrons-right" size={12} color={Theme.textTertiary} /> Swipe right to complete
            </Text>
            <View style={styles.tasksList}>
              {getPendingGoals().map(({ goal, cardTitle, cardId }) => (
                <SwipeableTaskItem
                  key={goal.id}
                  goal={goal}
                  cardTitle={cardTitle}
                  onComplete={() => handleToggleGoal(goal.id, cardId)}
                />
              ))}
            </View>
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
                    <View style={[styles.friendAvatar, { backgroundColor: Colors.mint600 }]}>
                      <Text style={styles.friendInitial}>{getInitials(friend.name)}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeFriendButton}
                      onPress={() => handleRemoveFriend(friend)}
                      activeOpacity={0.7}
                    >
                      <Icon name="x" size={12} color={Colors.white} />
                    </TouchableOpacity>
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
        defaultGroup={selectedGroup}
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
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
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
    paddingVertical: Spacing.md,
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
    backgroundColor: Colors.mint700,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: Spacing.lg,
    height: 56,
  },
  addGoalButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  addGoalIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addGoalButtonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Theme.textInverse,
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
    color: Colors.white,
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
    backgroundColor: Colors.white,
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
    color: Colors.white,
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
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendInitial: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  removeFriendButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.red500,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  friendName: {
    fontSize: FontSize.sm,
    color: Theme.textSecondary,
    textAlign: 'center',
    fontWeight: FontWeight.medium,
  },
});

export default Dashboard;
