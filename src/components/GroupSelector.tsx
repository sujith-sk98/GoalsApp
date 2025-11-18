/**
 * GroupSelector Component
 * 
 * Dropdown selector for choosing between different goal groups.
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Theme, Spacing, FontSize, FontWeight, BorderRadius, Colors } from '../utils/theme';
import { GoalGroup } from '../constants/constants';
import ConfirmDialog from './ConfirmDialog';

type GroupSelectorProps = {
  groups: GoalGroup[];
  selectedGroup: GoalGroup;
  onSelectGroup: (group: GoalGroup) => void;
  onDeleteGroup?: (groupId: string) => void;
  showAllOption?: boolean;
};

const GroupSelector = ({ groups, selectedGroup, onSelectGroup, onDeleteGroup, showAllOption = false }: GroupSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<GoalGroup | null>(null);

  // Create "All Groups" option
  const allGroupsOption: GoalGroup = {
    id: 'all',
    name: 'All Groups',
    color: '#10b981', // Colors.mint700
    friendIds: [],
    cards: [],
  };

  // Combine "All" option with regular groups if enabled
  const displayGroups = showAllOption ? [allGroupsOption, ...groups] : groups;

  const handleSelect = (group: GoalGroup) => {
    onSelectGroup(group);
    setIsOpen(false);
  };

  const handleDeletePress = (group: GoalGroup, event: any) => {
    event.stopPropagation();
    // Prevent deleting the "All" option
    if (group.id === 'all') {
      return;
    }
    setGroupToDelete(group);
    setDeleteConfirmVisible(true);
  };

  const handleConfirmDelete = () => {
    if (groupToDelete && onDeleteGroup) {
      onDeleteGroup(groupToDelete.id);
      setDeleteConfirmVisible(false);
      setGroupToDelete(null);
      setIsOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmVisible(false);
    setGroupToDelete(null);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.selectedText} numberOfLines={1}>
          {selectedGroup.name}
        </Text>
        <Icon name="chevron-down" size={20} color={Theme.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdown}>
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownTitle}>Select Group</Text>
                <TouchableOpacity onPress={() => setIsOpen(false)}>
                  <Icon name="x" size={24} color={Theme.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={displayGroups}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      item.id === selectedGroup.id && styles.selectedOption,
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionContent}>
                      {item.id === 'all' && (
                        <Icon name="grid" size={18} color={Theme.primary} style={styles.allIcon} />
                      )}
                      <Text
                        style={[
                          styles.optionText,
                          item.id === selectedGroup.id && styles.selectedOptionText,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </View>
                    <View style={styles.optionIcons}>
                      {item.id === selectedGroup.id && (
                        <Icon name="check" size={20} color={Theme.primary} style={styles.checkIcon} />
                      )}
                      {onDeleteGroup && item.id !== 'all' && (
                        <TouchableOpacity
                          onPress={(e) => handleDeletePress(item, e)}
                          style={styles.deleteButton}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Icon name="trash-2" size={18} color={Colors.red600} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        visible={deleteConfirmVisible}
        title="Delete Group"
        message={groupToDelete ? `Are you sure you want to delete "${groupToDelete.name}"? This action cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        destructive={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.backgroundSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    minWidth: 140,
    maxWidth: 180,
  },
  selectedText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Theme.textPrimary,
    marginRight: Spacing.xs,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  dropdownContainer: {
    width: '100%',
    maxWidth: 320,
  },
  dropdown: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    maxHeight: 400,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
  },
  dropdownTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Theme.textPrimary,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
  },
  selectedOption: {
    backgroundColor: Theme.primaryLight,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
  },
  allIcon: {
    marginRight: Spacing.xs,
  },
  optionText: {
    fontSize: FontSize.base,
    color: Theme.textPrimary,
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: FontWeight.semibold,
    color: Theme.primary,
  },
  optionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkIcon: {
    marginRight: Spacing.xs,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
});

export default GroupSelector;
