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

type GroupSelectorProps = {
  groups: GoalGroup[];
  selectedGroup: GoalGroup;
  onSelectGroup: (group: GoalGroup) => void;
};

const GroupSelector = ({ groups, selectedGroup, onSelectGroup }: GroupSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (group: GoalGroup) => {
    onSelectGroup(group);
    setIsOpen(false);
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
                data={groups}
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
                    <Text
                      style={[
                        styles.optionText,
                        item.id === selectedGroup.id && styles.selectedOptionText,
                      ]}
                    >
                      {item.name}
                    </Text>
                    {item.id === selectedGroup.id && (
                      <Icon name="check" size={20} color={Theme.primary} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  optionText: {
    fontSize: FontSize.base,
    color: Theme.textPrimary,
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: FontWeight.semibold,
    color: Theme.primary,
  },
});

export default GroupSelector;
