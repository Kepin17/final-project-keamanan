# Real-time Notifications Update

## Summary

Updated the real-time notification system to only show notifications when data changes due to CRUD operations, not during initial data loading.

## Changes Made

### 1. Updated `useRealtimeData` Hook

- Added `isInitialLoad` flag to track initial data loading
- Modified `lastUpdated` to only be set after initial load is complete
- Added `forceUpdate()` method to trigger notifications on next data change
- Updated return object to include `isInitialLoad` and `forceUpdate`

### 2. Updated Components

- **MyAccessRequestsFragment**: Modified to only show notifications when `!isInitialLoad`
- **AdminAccessRequestFragment**: Same notification logic applied
- **PatientDataFragment**: Same notification logic applied

### 3. CRUD Operation Notifications

- Replaced `refreshData()` calls with `forceUpdate()` after CRUD operations
- This ensures notifications appear when data changes due to user actions

## How It Works

1. **Initial Load**: When component mounts, `isInitialLoad = true`, no notifications shown
2. **Subsequent Updates**: After initial load, `isInitialLoad = false`, notifications shown for real data changes
3. **CRUD Operations**: Call `forceUpdate()` to ensure next data change triggers notification

## Benefits

- Cleaner UX: No spam notifications during page load
- Relevant notifications: Only shows when actual changes occur
- Better user feedback: Users know when their actions result in data updates
