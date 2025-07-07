# Realtime Data Implementation

## Overview

Sistem MedInsight sekarang mendukung realtime data updates untuk:

- **Access Requests** (Admin & Doctor views)
- **Patient Records** (Doctor view)
- **My Access Requests** (Doctor view)

## Implementation Details

### Backend Events

1. **AccessRequestUpdated Event**

   - Triggered when: Created, Approved, Rejected
   - Channels: `access-requests`, `access-requests.user.{doctor_id}`
   - Data: Complete access request object with doctor/patient info

2. **PatientRecordUpdated Event**
   - Triggered when: Created, Updated
   - Channels: `patient-records`
   - Data: Complete patient object with medical history

### Frontend Realtime Hook

**File**: `client/src/hooks/useRealtimeData.js`

**Features**:

- Smart polling with configurable intervals
- Browser tab visibility detection (pauses when tab is hidden)
- Data change detection (prevents unnecessary re-renders)
- Error handling and retry logic
- Automatic refresh on window focus
- Loading states and error reporting

**Usage**:

```javascript
import { useRealtimeAccessRequests, useRealtimePatients, useRealtimeMyAccessRequests } from "../hooks/useRealtimeData";

// In component:
const { data, loading, error, lastUpdated, refreshData } = useRealtimeAccessRequests();
```

## Updated Components

### 1. AdminAccessRequestFragment

- **File**: `client/src/components/fragments/AdminAccessRequestFragment/index.jsx`
- **Polling**: Every 3 seconds
- **Features**:
  - Real-time pending requests
  - Real-time approval history
  - Toast notifications for updates
  - Instant UI updates after approve/reject actions

### 2. MyAccessRequestsFragment

- **File**: `client/src/components/fragments/MyAccessRequestsFragment/index.jsx`
- **Polling**: Every 3 seconds
- **Features**:
  - Real-time status updates for doctor's requests
  - Toast notifications when status changes
  - Automatic refresh when requests are approved/rejected

### 3. PatientDataFragment

- **File**: `client/src/components/fragments/PatientDataFragment/index.jsx`
- **Polling**: Every 5 seconds
- **Features**:
  - Real-time patient list updates
  - Toast notifications for new patients
  - Instant updates after creating new patients

## Performance Optimizations

### Smart Polling

- **Frequency**: Different intervals based on data importance
  - Access Requests: 3 seconds (high priority)
  - Patient Records: 5 seconds (medium priority)
- **Pause on Tab Hidden**: Saves bandwidth and server resources
- **Resume on Focus**: Immediately updates when user returns

### Data Change Detection

- JSON comparison to prevent unnecessary re-renders
- Only updates state when actual data changes
- Preserves component performance

### Error Handling

- Network error recovery
- Authentication error handling
- Graceful degradation when API is unavailable

## Backend Controller Updates

### AccessRequestController

- **File**: `server/app/Http/Controllers/API/AccessRequestController.php`
- **Changes**:
  - Added `event(new AccessRequestUpdated())` on create
  - Added `event(new AccessRequestUpdated())` on approve
  - Added `event(new AccessRequestUpdated())` on reject

### PatientController

- **File**: `server/app/Http/Controllers/API/PatientController.php`
- **Changes**:
  - Added `event(new PatientRecordUpdated())` on create
  - Added `event(new PatientRecordUpdated())` on update

## User Experience Improvements

### Toast Notifications

- **Create/Update**: "Data updated" notifications
- **Actions**: Success/error feedback for user actions
- **Auto-dismiss**: Notifications auto-close after 2-5 seconds
- **Non-intrusive**: Small notifications that don't block UI

### Loading States

- **Smart Loading**: Only shows loading on initial load
- **Background Updates**: Subsequent updates happen silently
- **Error Recovery**: "Try again" buttons for failed requests

## Configuration

### Polling Intervals

```javascript
// In useRealtimeData.js
const intervals = {
  accessRequests: 3000, // 3 seconds
  patients: 5000, // 5 seconds
  myRequests: 3000, // 3 seconds
};
```

### Toast Configuration

```javascript
// Auto-close times
const toastTimes = {
  info: 2000, // 2 seconds
  success: 5000, // 5 seconds
  error: 8000, // 8 seconds
};
```

## Future Enhancements

### WebSocket Implementation

For true real-time updates, consider implementing:

- Laravel WebSockets
- Pusher integration
- Socket.io for more advanced features

### Selective Updates

- Update only changed records instead of full lists
- Implement delta synchronization
- Add optimistic UI updates

### Offline Support

- Cache data for offline viewing
- Queue actions when offline
- Sync when connection restored

## Testing Realtime Features

### Manual Testing

1. **Admin View**:

   - Open access requests in browser
   - Submit new request from doctor account
   - Verify instant appearance in admin view

2. **Doctor View**:

   - Submit access request
   - Have admin approve from another browser
   - Verify instant status update

3. **Patient Records**:
   - Create new patient from one browser
   - Verify appearance in other browser tabs

### Performance Testing

- Monitor network requests in browser dev tools
- Check for memory leaks with long-running tabs
- Verify pause/resume behavior

## Troubleshooting

### Common Issues

1. **High CPU Usage**: Check polling intervals
2. **Memory Leaks**: Verify cleanup in useEffect
3. **Network Overload**: Reduce polling frequency
4. **Stale Data**: Check data comparison logic

### Debug Tools

- Browser network tab for monitoring requests
- React Developer Tools for component re-renders
- Console logs for data change detection
