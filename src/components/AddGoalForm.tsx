/**
 * AddGoalForm Component
 * 
 * Modal form for creating a new goal.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Theme, Spacing, FontSize, FontWeight, Colors } from '../utils/theme';
import { MOCK_GOAL_GROUPS, MOCK_FRIENDS, type GoalGroup, type Friend } from '../constants/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type GoalFrequency = 'daily' | 'weekly' | 'monthly';

interface AddGoalFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (goalData: { 
    title: string; 
    frequency: GoalFrequency; 
    groupId: string;
  }) => void;
  defaultGroup?: GoalGroup;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({
  visible,
  onClose,
  onSubmit,
  defaultGroup,
}) => {
  const [goalTitle, setGoalTitle] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState<GoalFrequency>('daily');
  const [selectedGroup, setSelectedGroup] = useState<GoalGroup | null>(null);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const inset = useSafeAreaInsets();

  // Set default group when modal opens
  useEffect(() => {
    if (visible && defaultGroup) {
      setSelectedGroup(defaultGroup);
    }
  }, [visible, defaultGroup]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleReset = () => {
    setGoalTitle('');
    setSelectedFrequency('daily');
    setSelectedGroup(null);
    setShowGroupDropdown(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = () => {
    if (!goalTitle.trim() || !selectedGroup) {
      return;
    }

    onSubmit({
      title: goalTitle.trim(),
      frequency: selectedFrequency,
      groupId: selectedGroup.id,
    });

    handleReset();
    onClose();
  };

  const getGroupFriends = (): Friend[] => {
    if (!selectedGroup || selectedGroup.friendIds.length === 0) {
      return [];
    }
    return MOCK_FRIENDS.filter(friend => selectedGroup.friendIds.includes(friend.id));
  };

  const isFormValid = goalTitle.trim() && selectedGroup;

  const frequencyOptions: { value: GoalFrequency; label: string; icon: string }[] = [
    { value: 'daily', label: 'Daily', icon: 'sun' },
    { value: 'weekly', label: 'Weekly', icon: 'calendar' },
    { value: 'monthly', label: 'Monthly', icon: 'trending-up' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={[styles.modalOverlay, { marginBottom: isKeyboardVisible ? 0 : inset.bottom }]}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconContainer}>
                <Icon name="target" size={24} color={Theme.primary} />
              </View>
              <Text style={styles.title}>Add New Goal</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="x" size={24} color={Theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Goal Title Input */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Goal Title *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Morning workout - 30 minutes"
                placeholderTextColor={Theme.inputPlaceholder}
                value={goalTitle}
                onChangeText={setGoalTitle}
                maxLength={100}
              />
            </View>

            {/* Frequency Selector */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Frequency *</Text>
              <View style={styles.frequencyGrid}>
                {frequencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.frequencyOption,
                      selectedFrequency === option.value && styles.frequencyOptionSelected,
                    ]}
                    onPress={() => setSelectedFrequency(option.value)}
                    activeOpacity={0.7}
                  >
                    <Icon 
                      name={option.icon} 
                      size={24} 
                      color={selectedFrequency === option.value ? Colors.white : Theme.primary} 
                    />
                    <Text 
                      style={[
                        styles.frequencyLabel,
                        selectedFrequency === option.value && styles.frequencyLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Group Selector */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Select Group *</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowGroupDropdown(!showGroupDropdown)}
                activeOpacity={0.7}
              >
                <View style={styles.dropdownButtonContent}>
                  {selectedGroup ? (
                    <>
                      <View 
                        style={[
                          styles.groupColorDot, 
                          { backgroundColor: selectedGroup.color || Theme.primary }
                        ]} 
                      />
                      <Text style={styles.dropdownText}>{selectedGroup.name}</Text>
                    </>
                  ) : (
                    <Text style={styles.dropdownPlaceholder}>Choose a group</Text>
                  )}
                </View>
                <Icon
                  name={showGroupDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={Theme.textTertiary}
                />
              </TouchableOpacity>

              {/* Group List Dropdown */}
              {showGroupDropdown && (
                <View style={styles.groupsList}>
                  {MOCK_GOAL_GROUPS.length === 0 ? (
                    <Text style={styles.emptyText}>No groups available</Text>
                  ) : (
                    MOCK_GOAL_GROUPS.map((group) => (
                      <TouchableOpacity
                        key={group.id}
                        style={styles.groupItem}
                        onPress={() => {
                          setSelectedGroup(group);
                          setShowGroupDropdown(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={styles.groupInfo}>
                          <View 
                            style={[
                              styles.groupColorIndicator, 
                              { backgroundColor: group.color || Theme.primary }
                            ]} 
                          />
                          <Text style={styles.groupName}>{group.name}</Text>
                        </View>
                        {selectedGroup?.id === group.id && (
                          <Icon name="check" size={20} color={Theme.primary} />
                        )}
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
            </View>

            {/* Friends Display (Read-only) */}
            {selectedGroup && (
              <View style={styles.formSection}>
                <Text style={styles.label}>Shared With</Text>
                {getGroupFriends().length === 0 ? (
                  <View style={styles.noFriendsCard}>
                    <Icon name="users" size={20} color={Theme.textTertiary} />
                    <Text style={styles.noFriendsText}>Just you - no friends in this group</Text>
                  </View>
                ) : (
                  <View style={styles.friendsCard}>
                    {getGroupFriends().map((friend) => (
                      <View key={friend.id} style={styles.friendChip}>
                        <View style={styles.friendChipAvatar}>
                          <Icon name="user" size={12} color={Colors.white} />
                        </View>
                        <Text style={styles.friendChipName}>{friend.name}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                !isFormValid && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid}
              activeOpacity={0.7}
            >
              <Icon name="plus" size={18} color={Colors.white} />
              <Text style={styles.submitButtonText}>Create Goal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Theme.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    paddingTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Theme.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Theme.textPrimary,
    flex: 1,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  formSection: {
    marginTop: Spacing.xl,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Theme.textPrimary,
    marginBottom: Spacing.sm,
  },
  textInput: {
    backgroundColor: Theme.background,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSize.base,
    color: Theme.textPrimary,
  },
  frequencyGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  frequencyOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.background,
    borderWidth: 2,
    borderColor: Theme.borderLight,
    borderRadius: 12,
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  frequencyOptionSelected: {
    backgroundColor: Theme.primary,
    borderColor: Theme.primary,
  },
  frequencyLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Theme.textPrimary,
  },
  frequencyLabelSelected: {
    color: Colors.white,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.background,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  dropdownButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
  },
  groupColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dropdownText: {
    fontSize: FontSize.base,
    color: Theme.textPrimary,
    flex: 1,
  },
  dropdownPlaceholder: {
    fontSize: FontSize.base,
    color: Theme.inputPlaceholder,
  },
  groupsList: {
    marginTop: Spacing.sm,
    backgroundColor: Theme.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    maxHeight: 200,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  groupColorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  groupName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Theme.textPrimary,
  },
  noFriendsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.background,
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  noFriendsText: {
    fontSize: FontSize.sm,
    color: Theme.textTertiary,
  },
  friendsCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  friendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.primaryLight,
    paddingLeft: 4,
    paddingRight: Spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    gap: Spacing.xs,
  },
  friendChipAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendChipName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Theme.textPrimary,
  },
  emptyText: {
    padding: Spacing.lg,
    textAlign: 'center',
    color: Theme.textTertiary,
    fontSize: FontSize.sm,
  },
  bottomSpacer: {
    height: Spacing.xxl,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    borderTopWidth: 1,
    borderTopColor: Theme.borderLight,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  cancelButton: {
    backgroundColor: Theme.background,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  cancelButtonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Theme.textSecondary,
  },
  submitButton: {
    backgroundColor: Theme.primary,
  },
  submitButtonDisabled: {
    backgroundColor: Theme.primaryDisabled,
  },
  submitButtonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
});

export default AddGoalForm;
