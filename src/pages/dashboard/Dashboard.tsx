/**
 * Dashboard Screen Component
 * 
 * Main screen shown after successful login.
 */

import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme, Spacing, FontSize, FontWeight, Colors } from '../../utils/theme';
import GoalCard from '../../components/GoalCard';
import GoalDetailModal from '../../components/GoalDetailModal';
import GroupSelector from '../../components/GroupSelector';
import { MOCK_GOAL_GROUPS, USER_INFO, GoalPeriodCard, GoalGroup } from '../../constants/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;

const Dashboard = () => {
  const flatListRef = useRef<FlatList>(null);
  const [selectedGroup, setSelectedGroup] = useState<GoalGroup>(MOCK_GOAL_GROUPS[0]);
  const [selectedCard, setSelectedCard] = useState<GoalPeriodCard | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCardPress = (card: GoalPeriodCard) => {
    setSelectedCard(card);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedCard(null), 300);
  };

  const handleScroll = (event: any) => {
    const slideSize = CARD_WIDTH + Spacing.lg;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideSize);
    setActiveIndex(index);
  };

  const renderGoalCard = ({ item }: { item: GoalPeriodCard }) => (
    <View style={styles.cardContainer}>
      <GoalCard group={item} onPress={() => handleCardPress(item)} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Greeting and Group Selector */}
      <View style={styles.header}>
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>{USER_INFO.greeting}</Text>
          <Text style={styles.name}>{USER_INFO.name}!</Text>
        </View>
        <GroupSelector
          groups={MOCK_GOAL_GROUPS}
          selectedGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
        />
      </View>

      {/* Goal Cards Carousel */}
      <View style={styles.carouselSection}>
        <FlatList
          ref={flatListRef}
          data={selectedGroup.cards}
          renderItem={renderGoalCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + Spacing.lg}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContent}
          pagingEnabled={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </View>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          {selectedGroup.cards.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Goal Detail Modal */}
      <GoalDetailModal
        visible={modalVisible}
        group={selectedCard}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  greetingSection: {
    flex: 1,
    marginRight: Spacing.md,
  },
  greeting: {
    fontSize: FontSize.base,
    color: Theme.textTertiary,
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: FontSize.xxxl + 4,
    fontWeight: FontWeight.bold,
    color: Theme.textPrimary,
  },
  carouselSection: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  carouselContent: {
    paddingLeft: Spacing.xl,
    paddingRight: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: Spacing.lg,
  },
  paginationContainer: {
    paddingVertical: Spacing.md,
    borderBottomColor: Theme.borderLight,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Theme.primary,
    width: 24,
    borderRadius: 4,
  },
  inactiveDot: {
    backgroundColor: Theme.borderLight,
  },
});

export default Dashboard;
