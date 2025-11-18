# Local Storage System Documentation

## Overview

This app uses a local-first storage architecture that persists data on the device using AsyncStorage. The system is designed to work offline and can be easily migrated to API-based storage later.

## Architecture

```
src/
├── storage/           # Storage layer
│   ├── StorageService.ts      # Low-level AsyncStorage wrapper
│   ├── GoalStorage.ts         # Goal/Group/Friend operations
│   ├── HistoryStorage.ts      # Historical data management
│   ├── ResetService.ts        # Auto-reset logic
│   └── SeedData.ts            # Initial data generator
├── hooks/             # React hooks for data access
│   ├── useGoals.ts            # Goal management hook
│   ├── useHistory.ts          # History access hook
│   └── useAutoReset.ts        # Auto-reset lifecycle hook
└── types/
    └── storage.types.ts       # TypeScript interfaces
```

## Key Features

### ✅ Data Persistence
- All data saved to device storage
- Survives app restarts
- Works completely offline

### ✅ Auto-Reset Cycles
- **Daily goals**: Reset at midnight
- **Weekly goals**: Reset on Monday 00:00
- **Monthly goals**: Reset on 1st of month 00:00
- Automatically archives completed goals before reset

### ✅ History Tracking
- Completed goals saved to history
- Stats available for any time period
- Data kept for 90 days by default

### ✅ API-Ready Design
- Clean separation of concerns
- Easy to swap storage with API calls
- Optimistic updates pattern ready

## Usage Examples

### Using the Hooks

```typescript
// In your component
import { useGoals, useAutoReset } from '../hooks';

function MyComponent() {
  const { 
    groups,           // All groups
    friends,          // All friends  
    loading,          // Loading state
    addGoal,          // Add new goal
    toggleGoal,       // Toggle completion
    deleteGroup,      // Delete group
    refresh           // Refresh data
  } = useGoals();

  // Auto-reset on app lifecycle changes
  useAutoReset({
    onResetComplete: () => {
      console.log('Goals have been reset');
      refresh();
    }
  });

  // Use the data
  return (
    <View>
      {groups.map(group => (
        <Text key={group.id}>{group.name}</Text>
      ))}
    </View>
  );
}
```

### Direct Storage Access

```typescript
import { GoalStorage, HistoryStorage, ResetService } from '../storage';

// Add a goal
const newGoal = await GoalStorage.addGoal(groupId, 'daily', 'My goal');

// Get history
const todayHistory = await HistoryStorage.getDailyHistory(new Date());

// Manually trigger reset
await ResetService.performResets();
```

## Data Structure

### Groups
```typescript
{
  id: string;
  name: string;
  color: string;
  friendIds: string[];
  cards: GoalPeriodCard[];
  createdAt: string;
  updatedAt: string;
}
```

### Goals
```typescript
{
  id: string;
  title: string;
  completed: boolean;
}
```

### History Entry
```typescript
{
  date: string;           // YYYY-MM-DD
  completed: number;      // Count of completed goals
  total: number;          // Total goals that day
  goals: CompletedGoalEntry[];
}
```

## Storage Keys

| Key | Description |
|-----|-------------|
| `@goals_app/groups` | All goal groups |
| `@goals_app/friends` | All friends |
| `@goals_app/user` | User profile |
| `@goals_app/history` | Historical data |
| `@goals_app/metadata` | Reset timestamps |
| `@goals_app/version` | Data version |

## Migration to API

When ready to add backend support:

1. **Keep the hooks interface** - No UI changes needed
2. **Replace storage calls** - Swap `GoalStorage.*` with API calls
3. **Add sync queue** - Use `SyncQueueItem` type (already defined)
4. **Handle conflicts** - Implement last-write-wins or custom logic

Example migration:
```typescript
// Before (local)
const groups = await GoalStorage.getGroups();

// After (API)
const response = await fetch('/api/groups');
const groups = await response.json();
```

## Reset Logic Details

### Daily Reset
- Triggers: When current date ≠ last reset date
- Archives: All completed daily goals
- Resets: All daily goals to incomplete

### Weekly Reset  
- Triggers: When current week ≠ last reset week
- Week starts: Monday 00:00
- Archives: All completed weekly goals

### Monthly Reset
- Triggers: When current month ≠ last reset month
- Archives: All completed monthly goals

## Initial Data

On first launch, the app creates:
- 3 starter groups (Health, Work, Learning)
- Sample goals for each frequency
- 3 sample friends
- User profile

## Maintenance

### Clear old history
```typescript
await HistoryStorage.clearOldHistory(90); // Keep 90 days
```

### Clear all data (testing)
```typescript
await StorageService.clearAll();
```

### Force reset
```typescript
await ResetService.forceResetAll();
```

## Performance

- **Read latency**: ~1-2ms (cached)
- **Write latency**: ~5-10ms
- **Storage limit**: ~6MB on Android
- **Recommended max**: 10,000 goals total

## Best Practices

1. ✅ Always use hooks in components
2. ✅ Debounce frequent writes (goal toggles)
3. ✅ Handle loading states
4. ✅ Test with airplane mode
5. ✅ Provide export/import feature for backups

## Troubleshooting

### Data not persisting
- Check AsyncStorage permissions
- Verify no errors in console
- Try clearing app data and reinstalling

### Reset not working
- Check metadata timestamps
- Verify date-fns is installed
- Check timezone settings

### Performance issues
- Clear old history
- Reduce number of goals
- Check for memory leaks in listeners
