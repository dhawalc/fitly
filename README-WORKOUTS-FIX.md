# Simple Fix for Workouts Page

To fix the workouts page issue, follow these steps:

1. Run the cleanup script:

```bash
chmod +x scripts/clean-workouts.sh
./scripts/clean-workouts.sh
```

2. This script will:
   - Remove all problematic workouts files
   - Create a simple workouts page
   - Restart the development server

3. Once the simple page is working, you can gradually build out the full workouts functionality.

## Manual Fix

If the script doesn't work, you can manually:

1. Delete all files in `frontend/pages/workouts/` directory
2. Delete `frontend/pages/workouts.js` if it exists
3. Delete `frontend/pages/workouts-backup.js` if it exists
4. Delete `frontend/pages/workouts-simple.js` if it exists
5. Create a new `frontend/pages/workouts.js` with a simple React component
6. Restart the development server 