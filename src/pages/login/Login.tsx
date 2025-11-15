/**
 * Login Screen Component
 * 
 * Dependencies:
 * - react-native-vector-icons (optional): Run `npm install react-native-vector-icons` and link.
 *   For custom fonts like Pacifico, use react-native-custom-fonts or add to assets and link:
 *   https://github.com/react-native-community/react-native-custom-fonts
 * 
 * This component uses plain React Native APIs and works on both Android and iOS.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme, Colors, BorderRadius } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
// Uncomment if using react-native-vector-icons:
import Icon from 'react-native-vector-icons/Feather';

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const Login = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showError, setShowError] = useState(false);

  // Validate and handle continue action
  const handleContinue = () => {
    Keyboard.dismiss();
    setShowError(false);

    if (phoneNumber.trim().length < 8) {
      setShowError(true);
      return;
    }

    // Success flow - Navigate to Dashboard
    console.log('Phone number submitted:', phoneNumber);
    navigation.navigate('Dashboard');
  };

  // Handle Gmail login
  const handleGmailLogin = () => {
    Keyboard.dismiss();
    console.log('Gmail login initiated');
    Alert.alert('Gmail Login', 'Gmail authentication would be handled here');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Main Card Container */}
          <View style={styles.card}>
            
            {/* Top Section: Header */}
            <View style={styles.topSection}>
              {/* Header Section: Icon + Title + Subtitle */}
              <View style={styles.header}>
                {/* App Icon with Plus */}
                <View style={styles.iconContainer}>
                  <Text style={styles.iconText}>+</Text>
                  {/* Alternative with vector icons:
                  <Icon name="plus" size={32} color="#FFFFFF" />
                  */}
                </View>

                {/* App Title - Script font */}
                <Text style={styles.title}>Goals</Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                  Welcome back! Please sign in to continue
                </Text>
              </View>
            </View>

            {/* Middle Section: Input + Buttons */}
            <View style={styles.middleSection}>
              {/* Phone Input Section */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={[
                    styles.input,
                    showError && styles.inputError,
                  ]}
                  placeholder="Enter your phone number"
                  placeholderTextColor={Theme.inputPlaceholder}
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    setShowError(false);
                  }}
                  keyboardType="phone-pad"
                  maxLength={15}
                  accessibilityLabel="Phone number input"
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                />
                {showError && (
                  <Text style={styles.errorText}>
                    Please enter at least 8 digits
                  </Text>
                )}
              </View>

              {/* Primary CTA Button */}
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  phoneNumber.trim().length < 4 && styles.primaryButtonDisabled,
                ]}
                onPress={handleContinue}
                disabled={phoneNumber.trim().length === 0}
                accessibilityLabel="Continue button"
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
              </TouchableOpacity>

              {/* Divider with "or" */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Secondary CTA - Gmail Login */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleGmailLogin}
                accessibilityLabel="Continue with Gmail button"
                activeOpacity={0.8}
              >
                {/* Mail Icon */}
                <View style={styles.gmailIcon}>
                  <Icon name="mail" size={20} color={Theme.primary} />
                </View>
                <Text style={styles.secondaryButtonText}>Continue with Gmail</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Section: Terms */}
            <View style={styles.bottomSection}>
              {/* Terms Text */}
              <Text style={styles.termsText}>
                By continuing, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.backgroundPale, // Pale mint/seafoam background
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  
  // Main Card
  card: {
    flex: 1,
    backgroundColor: Theme.backgroundPale,
    padding: 32,
    justifyContent: 'space-between',
  },

  // Layout sections
  topSection: {
    alignItems: 'center',
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomSection: {
    alignItems: 'center',
  },

  // Header Section
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Theme.primary, // Mint color
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 40,
    color: Theme.textInverse,
    fontWeight: '300',
  },
  title: {
    fontSize: 48,
    color: Theme.textPrimary,
    marginBottom: 8,
    fontFamily: 'Caveat-Bold', // Handwritten font
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Theme.textTertiary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },

  // Input Section
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.textPrimary,
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Theme.inputText,
    borderWidth: 1,
    borderColor: Theme.inputBorder,
  },
  inputError: {
    borderColor: Theme.error,
  },
  errorText: {
    fontSize: 12,
    color: Theme.error,
    marginTop: 6,
    marginLeft: 4,
  },

  // Primary Button
  primaryButton: {
    height: 56,
    backgroundColor: Theme.primary,
    borderRadius: BorderRadius.lg, // rounded-2xl (24px)
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    // iOS shadow
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Android shadow
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: Theme.primaryDisabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.textInverse,
    letterSpacing: 0.5,
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
    marginTop: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.borderLight,
  },
  dividerText: {
    fontSize: 14,
    color: Theme.textTertiary,
    paddingHorizontal: 16,
    fontWeight: '500',
  },

  // Secondary Button (Gmail)
  secondaryButton: {
    height: 56,
    backgroundColor: Theme.background,
    borderRadius: BorderRadius.lg, // rounded-2xl (24px)
    borderWidth: 1.5,
    borderColor: Theme.borderLight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  gmailIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  gmailIconText: {
    fontSize: 18,
    color: Theme.primary,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.textPrimary,
    letterSpacing: 0.3,
  },

  // Terms
  termsText: {
    fontSize: 13,
    color: Theme.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  termsLink: {
    color: Theme.primary,
    fontWeight: '600',
  },
});

export default Login;