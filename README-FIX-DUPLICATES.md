# Fixing Duplicate Pages Issue

There is currently an issue with duplicate pages in the Next.js application. This happens when both `pages/workouts.js` and `pages/workouts/index.js` exist, or when both `pages/settings.js` and `pages/settings/index.js` exist.

## How to Fix

Run the following script to fix the duplicate pages issue:

```bash
chmod +x scripts/fix-duplicates.sh
./scripts/fix-duplicates.sh
```

This script will:
1. Check if duplicate pages exist
2. Remove the duplicate pages in the subdirectories (keeping the original files)
3. Preserve all the original content and functionality

## Manual Fix

If the script doesn't work, you can manually:

1. Delete `frontend/pages/workouts/index.js` if both `workouts.js` and `workouts/index.js` exist
2. Delete `frontend/pages/settings/index.js` if both `settings.js` and `settings/index.js` exist

## Why This Happens

In Next.js, both `pages/workouts.js` and `pages/workouts/index.js` resolve to the same route (`/workouts`), which causes a conflict. The same applies to `settings.js` and `settings/index.js`. 