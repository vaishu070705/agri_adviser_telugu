

## Admin Dashboard Live Data Fix

### Root Cause Analysis

The database schema, RLS policies, and tables are all correct. Data IS being persisted for some modules (disease_logs: 4 rows, yield_logs: 1, farmers: 1, workers: 2) but **crop_logs and fertilizer_logs have 0 rows**.

The issues are:

1. **`as any` type casts** in `activityLogService.ts` — these bypass TypeScript's type checking and can hide runtime errors silently. The types file already has all tables defined, so these casts are unnecessary and harmful.

2. **Dashboard `as any` casts** — same problem in fetch queries, potentially causing silent failures in count/select operations.

3. **No error surfacing** — errors are only logged to console, never shown to the user, so failures go unnoticed.

### Plan

**1. Fix activityLogService.ts — Remove all `as any` casts**

Replace every `supabase.from('table_name' as any)` with `supabase.from('table_name')` throughout the file. The generated types already include `crop_logs`, `disease_logs`, `yield_logs`, `fertilizer_logs`, and `alerts`, so the casts are unnecessary and prevent proper error detection. Approximately 12 occurrences to fix.

**2. Fix dashboardService.ts — Remove `as any` casts**

Same fix for the `getDbCounts()` function — remove casts on `farmers`, `workers`, `worker_tasks` queries.

**3. Add error toast notifications to logging functions**

Currently errors only go to `console.error`. Add `toast.error()` calls so users see when logging fails, enabling faster debugging.

**4. Fix type signature for `setDiseaseResult`**

Update `FarmerContextType` so `setDiseaseResult` accepts `DiseaseResult | null` (it's currently called with `null` in DiseaseDetection.tsx but the type doesn't allow it).

### Files to Modify

- `src/services/activityLogService.ts` — Remove ~12 `as any` casts, add toast error feedback
- `src/services/dashboardService.ts` — Remove `as any` casts on 3 queries
- `src/contexts/FarmerContext.tsx` — Fix `setDiseaseResult` type to accept `null`

No database schema changes needed — tables and policies are already correct.

