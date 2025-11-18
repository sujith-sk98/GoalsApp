/**
 * SwipeableTaskItem Component
 * 
 * A task item that can be swiped right to mark as complete.
 * Provides visual feedback with animations and prevents accidental completion.
 */

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Theme, Spacing, FontSize, FontWeight, Colors, BorderRadius } from '../utils/theme';
import { Goal } from './GoalItem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;

interface SwipeableTaskItemProps {
  goal: Goal;
  cardTitle: string;
  onComplete: () => void;
}

const SwipeableTaskItem: React.FC<SwipeableTaskItemProps> = ({ goal, cardTitle, onComplete }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [swiping, setSwiping] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderGrant: () => {
        setSwiping(true);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow right swipe (positive dx)
        if (gestureState.dx > 0) {
          translateX.setValue(Math.min(gestureState.dx, SWIPE_THRESHOLD + 20));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setSwiping(false);
        if (gestureState.dx > SWIPE_THRESHOLD) {
          // Complete the task
          Animated.timing(translateX, {
            toValue: SCREEN_WIDTH,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onComplete();
            translateX.setValue(0);
          });
        } else {
          // Snap back
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const checkboxScale = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [1, 1.2],
    extrapolate: 'clamp',
  });

  const checkmarkOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const completeTextOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD - 20, SWIPE_THRESHOLD],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.taskItemContainer}>
      {/* Background Complete Indicator */}
      <Animated.View 
        style={[
          styles.completeBackground,
          { opacity: completeTextOpacity }
        ]}
      >
        <Icon name="check-circle" size={20} color={Colors.white} />
        <Text style={styles.completeBackgroundText}>Complete</Text>
      </Animated.View>

      {/* Swipeable Task */}
      <Animated.View
        style={[
          styles.taskItemSwipeable,
          { transform: [{ translateX }] }
        ]}
        {...panResponder.panHandlers}
      >
        <Animated.View 
          style={[
            styles.checkbox,
            { transform: [{ scale: checkboxScale }] }
          ]}
        >
          <Animated.View style={[styles.checkboxInner, { opacity: checkmarkOpacity }]}>
            <Icon name="check" size={12} color={Theme.primary} />
          </Animated.View>
        </Animated.View>
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle} numberOfLines={1}>{goal.title}</Text>
          <Text style={styles.taskCategory}>{cardTitle}</Text>
        </View>
        <Icon name="chevron-right" size={16} color={Theme.textTertiary} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskItemContainer: {
    position: 'relative',
    height: 56,
    marginBottom: Spacing.xs,
  },
  completeBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Theme.success,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.lg,
    gap: Spacing.sm,
  },
  completeBackgroundText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Theme.textInverse,
  },
  taskItemSwipeable: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.background,
  },
  checkboxInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Theme.textPrimary,
  },
  taskCategory: {
    fontSize: FontSize.xs,
    color: Theme.textTertiary,
    marginTop: 2,
  },
});

export default SwipeableTaskItem;
