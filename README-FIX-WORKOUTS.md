# How to Fix the Workouts Page

There is currently an issue with the workouts page that causes a runtime error. Follow these steps to fix it:

## Option 1: Run the Fix Script (Recommended)

1. Open a terminal in the project root directory
2. Run the following command:

```bash
chmod +x scripts/fix-workouts-pages.sh
./scripts/fix-workouts-pages.sh
```

This script will:
- Remove all problematic files
- Create the proper directory structure
- Create new workouts pages with the correct code
- Restart the development server

## Option 2: Manual Fix

If the script doesn't work, you can manually fix the issue:

1. Delete these files if they exist:
   - `frontend/pages/workouts.js`
   - `frontend/pages/workouts-backup.js`

2. Make sure the `frontend/pages/workouts` directory exists:
   ```bash
   mkdir -p frontend/pages/workouts
   ```

3. Create the workouts index page at `frontend/pages/workouts/index.js` with the proper React component

4. Create the workout detail page at `frontend/pages/workouts/[id].js`

5. Update the layout component to point to `/workouts` instead of `/workouts-simple`

6. Restart the development server:
   ```bash
   cd frontend && npm run dev
   ```

## Temporary Solution

Until the issue is fixed, the navigation will point to a simple workouts page at `/workouts-simple` that doesn't have the error. 