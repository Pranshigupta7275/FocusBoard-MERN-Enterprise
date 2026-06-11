# Caching Implementation Guide

## Overview

Your MERN application now has a comprehensive caching system for frontend-to-backend data synchronization. This includes RTK Query caching, localStorage-based offline support, and optimistic updates.

## Features Implemented

### 1. **RTK Query Caching** (`src/api/apiSlice.ts`)

- **Automatic cache management** - Redux Toolkit Query handles request deduplication and caching
- **Tag-based invalidation** - Intelligent cache invalidation based on data type (Task, User, Stats)
- **Configurable TTL** - Time-to-live settings for different data types:
  - Tasks: 5 minutes
  - User: 10 minutes
  - Stats: 2 minutes
- **Optimistic updates** - UI updates immediately while request is in flight

### 2. **Cache Manager Utility** (`src/utils/cacheManager.ts`)

A robust utility for localStorage-based caching with features:

- `cacheManager.set(key, data, ttl)` - Store data with expiration
- `cacheManager.get(key)` - Retrieve valid cached data
- `cacheManager.remove(key)` - Remove specific cache entry
- `cacheManager.clear()` - Clear all cached data
- `cacheManager.getStats()` - Get cache statistics

### 3. **Custom Hook** (`src/hooks/useCachedData.ts`)

`useCachedData` hook provides:

- Automatic fetching with caching
- Fallback to localStorage on network errors
- Loading and error states
- Configurable TTL per data type

### 4. **Dashboard Optimization**

Refactored Dashboard component to use RTK Query hooks:

- Removed axios calls - now uses `useGetTasksQuery()`
- Automatic cache invalidation on mutations
- Real-time sync indicator (`🔄 Syncing...`)
- Better error handling
- Optimistic updates for user interactions

## Cache Behavior

### Data Flow

```
User Action → Optimistic UI Update → API Request → Cache Update → UI Confirmation
```

### Cache Invalidation

- **Create Task** → Invalidates entire Task cache, shows loading state
- **Update Task** → Updates specific task + entire list cache
- **Delete Task** → Removes from cache and UI
- **Login** → Clears User and Task cache for fresh data

### Offline Support

If network fails:

1. Component attempts API request
2. On failure, falls back to localStorage cache
3. Shows cached data to user
4. Auto-retries when connection restored

## API Endpoints with Caching

| Method | Endpoint        | Cache TTL | Tags              |
| ------ | --------------- | --------- | ----------------- |
| GET    | `/tasks`        | 5 min     | Task              |
| GET    | `/tasks/{id}`   | 5 min     | Task              |
| POST   | `/tasks`        | -         | Task (invalidate) |
| PUT    | `/tasks/{id}`   | -         | Task (invalidate) |
| DELETE | `/tasks/{id}`   | -         | Task (invalidate) |
| GET    | `/user/profile` | 10 min    | User              |
| GET    | `/admin/stats`  | 2 min     | Stats             |

## Usage Examples

### Using RTK Query in Components

```typescript
import { useGetTasksQuery, useCreateTaskMutation } from "../slices/apiSlice";

const MyComponent = () => {
  // Automatic caching with 5-minute TTL
  const { data: tasks, isLoading, isFetching, error } = useGetTasksQuery();

  // Mutation with optimistic updates
  const [createTask] = useCreateTaskMutation();

  // Handle creation
  const handleCreate = async (title) => {
    try {
      await createTask({ title }).unwrap();
      // Cache automatically invalidated and updated
    } catch (err) {
      console.error(err);
    }
  };
};
```

### Using Cache Manager Directly

```typescript
import { cacheManager } from "../utils/cacheManager";

// Store data
cacheManager.set("my_data", { foo: "bar" }, 300); // 5 minutes

// Retrieve data
const data = cacheManager.get("my_data");

// Check cache stats
const stats = cacheManager.getStats();
console.log(`Cache size: ${stats.size}`);
```

### Using Custom Hook

```typescript
import { useCachedData } from "../hooks/useCachedData";

const MyComponent = () => {
  const { data, isLoading, error } = useCachedData(
    "user_data",
    () => fetchUserData(), // Promise-returning function
    300, // 5 minute TTL
  );
};
```

## Performance Benefits

1. **Reduced Network Requests** - Same data reused within TTL window
2. **Faster UX** - Instant UI updates with optimistic updates
3. **Offline Support** - App continues working with cached data
4. **Bandwidth Savings** - Eliminated redundant API calls
5. **Server Load Reduction** - Fewer duplicate requests

## Debugging Cache

### Check Cache Status

```typescript
// In browser console
import { cacheManager } from "./utils/cacheManager";
cacheManager.getStats();
```

### Clear Cache

```typescript
cacheManager.clear();
```

### Monitor Redux DevTools

- Install Redux DevTools extension
- See cache state and invalidation patterns
- Inspect tag-based cache updates

## Configuration

### Adjust Cache TTL

Edit `CACHE_DURATION` in `src/api/apiSlice.ts`:

```typescript
const CACHE_DURATION = {
  TASKS: 5 * 60, // 5 minutes
  USER: 10 * 60, // 10 minutes
  STATS: 2 * 60, // 2 minutes
};
```

### Add New Cached Endpoints

1. Add new tag to `tagTypes` array
2. Create new query/mutation with appropriate tags
3. Set `keepUnusedDataFor` for cache duration
4. Use in components with RTK Query hooks

## Best Practices

1. ✅ Use RTK Query hooks instead of axios for API calls
2. ✅ Keep cache TTLs short for frequently changing data
3. ✅ Use optimistic updates for create/update/delete operations
4. ✅ Monitor cache size in browser DevTools
5. ✅ Clear cache on logout
6. ✅ Test offline functionality with DevTools Network throttling

## Troubleshooting

### Cache Not Updating

- Check if tags are correctly configured
- Verify mutation is invalidating correct tags
- Inspect Redux DevTools for cache state

### Stale Data Displayed

- Reduce TTL for that endpoint
- Force refresh with `refetch()` from query hook
- Clear cache manually if needed

### High Memory Usage

- Reduce number of cached queries
- Lower TTL values
- Remove unused cache entries
