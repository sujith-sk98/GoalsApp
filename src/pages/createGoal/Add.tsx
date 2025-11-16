/**
 * Add Screen Component
 * 
 * Screen for adding new goals, groups, and friends.
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { Theme, Spacing, FontSize, FontWeight, Colors, BorderRadius } from '../../utils/theme';
import AddGroupForm from '../../components/AddGroupForm';
import AddFriendForm from '../../components/AddFriendForm';
import AddGoalForm from '../../components/AddGoalForm';
import { MOCK_FRIENDS, addNewGroup, addNewFriend, addNewGoal } from '../../constants/constants';

const Add = () => {
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);

  const handleAddGoal = () => {
    setShowAddGoalForm(true);
  };

  const handleAddGroup = () => {
    setShowAddGroupForm(true);
  };

  const handleAddFriends = () => {
    setShowAddFriendForm(true);
  };

  const handleGoalSubmit = (goalData: { 
    title: string; 
    frequency: 'daily' | 'weekly' | 'monthly'; 
    groupId: string;
  }) => {
    const newGoal = addNewGoal(goalData.title, goalData.frequency, goalData.groupId);
    console.log('New goal created:', newGoal);
    // Show success feedback if needed
  };

  const handleGroupSubmit = (groupData: { name: string; color: string; friendIds: string[] }) => {
    const newGroup = addNewGroup(groupData.name, groupData.color, groupData.friendIds);
    console.log('New group created:', newGroup);
    // Show success feedback if needed
  };

  const handleFriendSubmit = (friendData: { name: string; email?: string; phone?: string }) => {
    const newFriend = addNewFriend(friendData.name, friendData.email, friendData.phone);
    console.log('Friend invited:', newFriend);
    // Show success feedback if needed
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Plan your progress</Text>
          <Text style={styles.headerSubtitle}>Create goals, groups, or connect with friends</Text>
        </View>

        {/* Add Goal Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBadge, { backgroundColor: Colors.green50 }]}>
              <Icon name="target" size={24} color={Colors.green600} />
            </View>
            <View style={styles.sectionTextContainer}>
              <Text style={styles.sectionTitle}>Add New Goal</Text>
              <Text style={styles.sectionDescription}>Create and track your personal goals</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.mint600 }]}
            onPress={handleAddGoal}
            activeOpacity={0.8}
          >
            <Icon name="plus" size={20} color={Colors.white} />
            <Text style={styles.buttonText}>Add Goal</Text>
            <Icon name="arrow-right" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Add Group Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBadge, { backgroundColor: Colors.green50 }]}>
              <Icon name="folder-plus" size={24} color={Colors.green600} />
            </View>
            <View style={styles.sectionTextContainer}>
              <Text style={styles.sectionTitle}>Add New Group</Text>
              <Text style={styles.sectionDescription}>Organize your goals into categories</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.mint500 }]}
            onPress={handleAddGroup}
            activeOpacity={0.8}
          >
            <Icon name="plus" size={20} color={Colors.white} />
            <Text style={styles.buttonText}>Add Group</Text>
            <Icon name="arrow-right" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Add Friends Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBadge, { backgroundColor: Colors.green50 }]}>
              <Icon name="user-plus" size={24} color={Colors.green600} />
            </View>
            <View style={styles.sectionTextContainer}>
              <Text style={styles.sectionTitle}>Add Friends</Text>
              <Text style={styles.sectionDescription}>Connect and share goals with friends</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.mint700 }]}
            onPress={handleAddFriends}
            activeOpacity={0.8}
          >
            <Icon name="plus" size={20} color={Colors.white} />
            <Text style={styles.buttonText}>Add Friends</Text>
            <Icon name="arrow-right" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Add Goal Form Modal */}
      <AddGoalForm
        visible={showAddGoalForm}
        onClose={() => setShowAddGoalForm(false)}
        onSubmit={handleGoalSubmit}
      />

      {/* Add Group Form Modal */}
      <AddGroupForm
        visible={showAddGroupForm}
        onClose={() => setShowAddGroupForm(false)}
        onSubmit={handleGroupSubmit}
        friends={MOCK_FRIENDS}
      />

      {/* Add Friend Form Modal */}
      <AddFriendForm
        visible={showAddFriendForm}
        onClose={() => setShowAddFriendForm(false)}
        onSubmit={handleFriendSubmit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl * 2,
  },
  headerTitle: {
    fontSize: FontSize.xxxl + 4,
    fontWeight: FontWeight.bold,
    color: Theme.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSize.base,
    color: Theme.textTertiary,
  },
  section: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: Theme.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  sectionTextContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Theme.textPrimary,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: FontSize.sm,
    color: Theme.textTertiary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: Spacing.lg,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
        fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Theme.textInverse,
    fontFamily: 'Caveat-Bold'
  },
  bottomSpacer: {
    height: Spacing.xxl,
  },
});

export default Add;
