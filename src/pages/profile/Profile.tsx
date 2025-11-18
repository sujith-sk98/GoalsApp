/**
 * Profile Screen Component
 * 
 * User profile and settings screen.
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { Theme, Spacing, FontSize, FontWeight, Colors } from '../../utils/theme';
import { RootStackParamList } from '../../../App';
import { GoalStorage } from '../../storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const Profile = () => {
  const navigation = useNavigation<NavigationProp>();
  const appVersion = require('../../../package.json').version;
  const [userInfo, setUserInfo] = React.useState<{ name: string; email: string; phone: string; isPremium: boolean }>({
    name: '',
    email: '',
    phone: '',
    isPremium: false,
  });
  useEffect(() => {
    const fetchUserInfo = async () => {
      const profile = await GoalStorage.getUser();
      if (profile) {
        setUserInfo({
          name: profile.name,
          email: profile.email,
          phone: profile.phone || '',
          isPremium: profile.isPremium,
        });
      }
    };
    fetchUserInfo();
  })

  const handleLogout = () => {
    // Navigate to login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon name="user" size={48} color={Colors.white} />
            </View>
            {userInfo.isPremium && (
              <View style={styles.premiumBadge}>
                <Icon name="star" size={16} color={Colors.yellow500} />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{userInfo.name}</Text>
          {userInfo.isPremium && (
            <View style={styles.premiumTag}>
              <Icon name="award" size={14} color={Colors.yellow600} />
              <Text style={styles.premiumText}>Premium Member</Text>
            </View>
          )}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconWrapper}>
                <Icon name="mail" size={20} color={Theme.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userInfo.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.iconWrapper}>
                <Icon name="phone" size={20} color={Theme.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{userInfo.phone}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconWrapper}>
                <Icon name="info" size={20} color={Theme.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Version</Text>
                <Text style={styles.infoValue}>{appVersion}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Icon name="log-out" size={20} color={Colors.white} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: FontSize.xxxl + 4,
    fontWeight: FontWeight.bold,
    color: Theme.textPrimary,
  },
  userCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    backgroundColor: Theme.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Theme.background,
    shadowColor: Theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  userName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Theme.textPrimary,
    marginBottom: Spacing.xs,
  },
  premiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Theme.warningLight,
    borderRadius: 20,
    gap: Spacing.xs,
  },
  premiumText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Theme.warning,
  },
  section: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Theme.textSecondary,
    marginBottom: Spacing.md,
  },
  infoCard: {
    backgroundColor: Theme.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Theme.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSize.sm,
    color: Theme.textTertiary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Theme.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.borderLight,
    marginHorizontal: Spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.error,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: 16,
    gap: Spacing.sm,
    shadowColor: Theme.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Theme.buttonPrimaryText,
  },
  bottomSpacer: {
    height: Spacing.xxl,
  },
});

export default Profile;
