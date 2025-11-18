/**
 * AddGroupForm Component
 * 
 * Modal form for creating a new goal group.
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
  Pressable,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Theme, Spacing, FontSize, FontWeight, Colors } from '../utils/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoalStorage } from '../storage';

interface Friend {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface AddGroupFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (groupData: { name: string; color: string; friendIds: string[] }) => void;
  friends: Friend[];
}

// Predefined theme colors for groups
const THEME_COLORS = [
  { id: 'mint', name: 'Mint', color: Colors.mint400 },
  { id: 'blue', name: 'Blue', color: Colors.blue600 },
  { id: 'green', name: 'Green', color: Colors.green600 },
  { id: 'purple', name: 'Purple', color: Colors.purple600 },
  { id: 'yellow', name: 'Yellow', color: Colors.yellow500 },
  { id: 'red', name: 'Red', color: Colors.red600 },
];

const AddGroupForm: React.FC<AddGroupFormProps> = ({
  visible,
  onClose,
  onSubmit,
  friends,
}) => {
  const [groupName, setGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState(THEME_COLORS[0].color);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [showFriendDropdown, setShowFriendDropdown] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const inset = useSafeAreaInsets();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    const getUserPremiumStatus = async () => {
      // Fetch user data from storage or context to determine premium status
      GoalStorage.getUser().then(user => {
        setIsPremium(user?.isPremium || false);
      });
    };
    getUserPremiumStatus();

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleReset = () => {
    setGroupName('');
    setSelectedColor(THEME_COLORS[0].color);
    setSelectedFriends([]);
    setShowFriendDropdown(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = () => {
    if (!groupName.trim()) {
      return;
    }

    onSubmit({
      name: groupName.trim(),
      color: selectedColor,
      friendIds: selectedFriends,
    });

    handleReset();
    onClose();
  };

  const toggleFriend = (friendId: string) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  const getSelectedFriendsText = () => {
    if (selectedFriends.length === 0) {
      return 'Select friends';
    }
    const selectedNames = friends
      .filter(f => selectedFriends.includes(f.id))
      .map(f => f.name);
    return selectedNames.join(', ');
  };

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
                <Icon name="folder-plus" size={24} color={Theme.primary} />
              </View>
              <Text style={styles.title}>Add New Group</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="x" size={24} color={Theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Group Name Input */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Group Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Health & Fitness"
                placeholderTextColor={Theme.inputPlaceholder}
                value={groupName}
                onChangeText={setGroupName}
                maxLength={50}
              />
            </View>

            {/* Color Theme Selector */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Group Theme</Text>
              <View style={styles.colorGrid}>
                {THEME_COLORS.map((themeColor) => (
                  <TouchableOpacity
                    key={themeColor.id}
                    style={[
                      styles.colorOption,
                      selectedColor === themeColor.color && styles.colorOptionSelected,
                    ]}
                    onPress={() => setSelectedColor(themeColor.color)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.colorCircle,
                        { backgroundColor: themeColor.color },
                      ]}
                    >
                      {selectedColor === themeColor.color && (
                        <Icon name="check" size={20} color={Colors.white} />
                      )}
                    </View>
                    <Text style={styles.colorName}>{themeColor.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Friends Selector */}
            <View style={styles.formSection}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Add Friends/Partner (Optional)</Text>
                {!isPremium && (
                  <View style={styles.premiumBadge}>
                    <Icon name="star" size={12} color={Colors.yellow600} />
                    <Text style={styles.premiumText}>Premium</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  !isPremium && styles.dropdownButtonDisabled,
                ]}
                onPress={() => isPremium && setShowFriendDropdown(!showFriendDropdown)}
                activeOpacity={isPremium ? 0.7 : 1}
                disabled={!isPremium}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    !isPremium && styles.dropdownTextDisabled,
                    selectedFriends.length === 0 && styles.dropdownPlaceholder,
                  ]}
                  numberOfLines={1}
                >
                  {!isPremium ? 'Upgrade to Premium to add friends' : getSelectedFriendsText()}
                </Text>
                {isPremium && (
                  <Icon
                    name={showFriendDropdown ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={Theme.textTertiary}
                  />
                )}
                {!isPremium && (
                  <Icon name="lock" size={18} color={Theme.textTertiary} />
                )}
              </TouchableOpacity>

              {/* Friend List Dropdown */}
              {showFriendDropdown && isPremium && (
                <View style={styles.friendsList}>
                  {friends.length === 0 ? (
                    <Text style={styles.emptyText}>No friends added yet</Text>
                  ) : (
                    friends.map((friend) => (
                      <TouchableOpacity
                        key={friend.id}
                        style={styles.friendItem}
                        onPress={() => toggleFriend(friend.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.friendInfo}>
                          <View style={styles.friendAvatar}>
                            <Icon name="user" size={16} color={Theme.primary} />
                          </View>
                          <View style={styles.friendDetails}>
                            <Text style={styles.friendName}>{friend.name}</Text>
                            <Text style={styles.friendEmail}>
                              {friend.email || friend.phone || 'No contact info'}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.checkbox,
                            selectedFriends.includes(friend.id) &&
                              styles.checkboxSelected,
                          ]}
                        >
                          {selectedFriends.includes(friend.id) && (
                            <Icon name="check" size={14} color={Colors.white} />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
            </View>

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
                !groupName.trim() && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!groupName.trim()}
              activeOpacity={0.7}
            >
              <Icon name="plus" size={18} color={Colors.white} />
              <Text style={styles.submitButtonText}>Create Group</Text>
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
    backgroundColor: Theme.surfaceElevated,
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Theme.textPrimary,
    marginBottom: Spacing.lg,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.warningLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginBottom: Spacing.lg,
  },
  premiumText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Theme.warning,
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
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  colorOption: {
    alignItems: 'center',
    width: '30%',
  },
  colorOptionSelected: {
    // Selected state styling handled by circle
  },
  colorCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  colorName: {
    fontSize: FontSize.sm,
    color: Theme.textSecondary,
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
  dropdownButtonDisabled: {
    backgroundColor: Theme.inputDisabled,
    opacity: 0.6,
  },
  dropdownText: {
    fontSize: FontSize.base,
    color: Theme.textPrimary,
    flex: 1,
  },
  dropdownTextDisabled: {
    color: Theme.textTertiary,
  },
  dropdownPlaceholder: {
    color: Theme.inputPlaceholder,
  },
  friendsList: {
    marginTop: Spacing.sm,
    backgroundColor: Theme.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    maxHeight: 200,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Theme.textPrimary,
    marginBottom: 2,
  },
  friendEmail: {
    fontSize: FontSize.sm,
    color: Theme.textTertiary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Theme.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Theme.primary,
    borderColor: Theme.primary,
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
    color: Theme.buttonPrimaryText,
  },
});

export default AddGroupForm;
