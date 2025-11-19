/**
 * GroupSelector Component
 * 
 * Dropdown selector for choosing between different goal groups.
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Theme, Spacing, FontSize, FontWeight, BorderRadius, Colors } from '../utils/theme';
import { GoalGroup } from '../types/storage.types';
import ConfirmDialog from './ConfirmDialog';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const inset = useSafeAreaInsets()

  // Create "All Groups" option
  const allGroupsOption: GoalGroup = {
    id: 'all',
    name: 'All Groups',
    color: Theme.accent,
    friendIds: [],
    cards: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    // Prevent deleting if only one group exists
    if (groups.length === 1) {
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
        <View style={styles.selectorContent}>
          <View style={[styles.colorIndicator, { backgroundColor: selectedGroup.color || Theme.primary }]} />
          <Text style={styles.selectedText} numberOfLines={1}>
            {selectedGroup.name}
          </Text>
        </View>
        <Icon name="chevron-down" size={18} color={Theme.textPrimary} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={[styles.overlay]}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          />
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.iconWrapper}>
                  <Icon name="layers" size={20} color={Theme.primary} />
                </View>
                <Text style={styles.modalTitle}>Your Groups</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="x" size={22} color={Theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Groups List */}
            <FlatList
              data={displayGroups}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.listContent}
                renderItem={({ item, index }) => {
                  const isSelected = item.id === selectedGroup.id;
                  const isAllGroup = item.id === 'all';
                  const canDelete = !isAllGroup && groups.length > 1;

                  return (
                    <TouchableOpacity
                      style={[
                        styles.groupCard,
                        isSelected && styles.groupCardSelected,
                        index === displayGroups.length - 1 && styles.groupCardLast,
                      ]}
                      onPress={() => handleSelect(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.groupCardLeft}>
                        {isAllGroup ? (
                          <View style={[styles.groupIcon, { backgroundColor: Theme.primaryLight }]}>
                            <Icon name="grid" size={18} color={Theme.primary} />
                          </View>
                        ) : (
                          <View style={[styles.groupIcon, { backgroundColor: item.color || Theme.primary }]}>
                            <Icon name="folder" size={18} color={Colors.white} />
                          </View>
                        )}
                        <View style={styles.groupInfo}>
                          <Text style={[styles.groupName, isSelected && styles.groupNameSelected]}>
                            {item.name}
                          </Text>
                          {!isAllGroup && (
                            <Text style={styles.groupMeta}>
                              {item.cards.reduce((total, card) => total + card.goals.length, 0)} goals
                            </Text>
                          )}
                        </View>
                      </View>

                      <View style={styles.groupCardRight}>
                        {isSelected && (
                          <View style={styles.checkBadge}>
                            <Icon name="check" size={14} color={Colors.white} />
                          </View>
                        )}
                        {canDelete && onDeleteGroup && (
                          <TouchableOpacity
                            onPress={(e) => handleDeletePress(item, e)}
                            style={[
                              styles.deleteButton,
                              groups.length === 1 && styles.deleteButtonDisabled,
                            ]}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            disabled={groups.length === 1}
                          >
                            <Icon 
                              name="trash-2" 
                              size={16} 
                              color={groups.length === 1 ? Theme.textTertiary : Theme.error} 
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        visible={deleteConfirmVisible}
        title="Delete Group"
        message={groupToDelete ? `Are you sure you want to delete "${groupToDelete.name}"? All goals in this group will be permanently removed.` : ''}
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
    justifyContent: 'space-between',
    backgroundColor: Theme.surfaceElevated,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.xl,
    minWidth: 140,
    maxWidth: 200,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    shadowColor: Theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.xs,
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  selectedText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Theme.textPrimary,
  },
  overlay: {
    flex: 1,
    backgroundColor: Theme.overlay,
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: Theme.surfaceElevated,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    maxHeight: '75%',
    shadowColor: Theme.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.borderLight,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    backgroundColor: Theme.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Theme.textPrimary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Theme.borderLight,
  },
  groupCardSelected: {
    backgroundColor: Theme.primaryLight,
    borderColor: Theme.primary,
  },
  groupCardLast: {
    marginBottom: 0,
  },
  groupCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  groupIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Theme.textPrimary,
    marginBottom: 2,
  },
  groupNameSelected: {
    color: Theme.primary,
  },
  groupMeta: {
    fontSize: FontSize.xs,
    color: Theme.textTertiary,
    fontWeight: FontWeight.medium,
  },
  groupCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  deleteButtonDisabled: {
    opacity: 0.3,
  },
});

export default GroupSelector;
