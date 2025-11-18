/**
 * AddFriendForm Component
 * 
 * Modal form for inviting friends to the app.
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AddFriendFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (friendData: { name: string; email?: string; phone?: string }) => void;
}

const AddFriendForm: React.FC<AddFriendFormProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [friendPhone, setFriendPhone] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
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

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleReset = () => {
    setFriendName('');
    setFriendEmail('');
    setFriendPhone('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = () => {
    if (!friendName.trim()) {
      return;
    }

    // At least one contact method is required
    if (!friendEmail.trim() && !friendPhone.trim()) {
      return;
    }

    // Validate email if provided
    if (friendEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(friendEmail.trim())) {
        // TODO: Show error message
        return;
      }
    }

    // Validate phone if provided
    if (friendPhone.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(friendPhone.trim())) {
        // TODO: Show error message
        return;
      }
    }

    const friendData: { name: string; email?: string; phone?: string } = {
      name: friendName.trim(),
    };

    if (friendEmail.trim()) {
      friendData.email = friendEmail.trim();
    }

    if (friendPhone.trim()) {
      friendData.phone = friendPhone.trim();
    }

    onSubmit(friendData);

    handleReset();
    onClose();
  };

  const isFormValid = friendName.trim() && (friendEmail.trim() || friendPhone.trim());

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
                <Icon name="user-plus" size={24} color={Theme.primary} />
              </View>
              <Text style={styles.title}>Invite Friend</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="x" size={24} color={Theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
          >

            {/* Friend Name Input */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Friend's Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., John Doe"
                placeholderTextColor={Theme.inputPlaceholder}
                value={friendName}
                onChangeText={setFriendName}
                maxLength={50}
              />
            </View>

            {/* Email Input */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., john.doe@example.com"
                placeholderTextColor={Theme.inputPlaceholder}
                value={friendEmail}
                onChangeText={setFriendEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                maxLength={100}
              />
            </View>

            {/* Phone Input */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., +1 234 567 8900"
                placeholderTextColor={Theme.inputPlaceholder}
                value={friendPhone}
                onChangeText={setFriendPhone}
                keyboardType="phone-pad"
                maxLength={20}
              />
              <Text style={styles.helperText}>
                Provide at least email or phone number to send invitation
              </Text>
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
                !isFormValid && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid}
              activeOpacity={0.7}
            >
              <Icon name="send" size={18} color={Colors.white} />
              <Text style={styles.submitButtonText}>Send Invite</Text>
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
    height: '85%',
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
  helperText: {
    fontSize: FontSize.sm,
    color: Theme.textTertiary,
    marginTop: Spacing.sm,
  },
  previewSection: {
    marginTop: Spacing.xl,
  },
  previewLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Theme.textPrimary,
    marginBottom: Spacing.sm,
  },
  previewCard: {
    backgroundColor: Theme.background,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  previewTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Theme.textPrimary,
  },
  previewTo: {
    fontSize: FontSize.sm,
    color: Theme.textSecondary,
    marginBottom: Spacing.sm,
  },
  previewMessage: {
    fontSize: FontSize.sm,
    color: Theme.textTertiary,
    lineHeight: 20,
    fontStyle: 'italic',
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

export default AddFriendForm;
