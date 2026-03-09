# Quick Start Guide - ReceiptRadar

## Prerequisites

✅ Node.js installed  
✅ npm installed  
✅ Android emulator running (or physical device connected)

## Running the App

### Option 1: Using Expo Go (Recommended for Development)

1. **Start the Expo development server:**
   ```bash
   npm start
   ```
   or
   ```bash
   npm run android
   ```

2. **On your Android emulator:**
   - Press `a` in the terminal to open on Android emulator
   - OR scan the QR code with Expo Go app on your phone

### Option 2: Development Build (If you have Expo CLI tools)

```bash
npx expo start --android
```

## What to Expect

1. **Login Screen** - Simple dummy login page
   - Click "Continue" to proceed (no real authentication)

2. **Home Tab** - Dashboard with:
   - This month's spending (currently kr 0)
   - Upload Receipt button
   - Latest receipts section

3. **Bottom Navigation** - 5 tabs:
   - Home
   - Receipts
   - Shopping
   - Analytics
   - Profile

## Troubleshooting

### If the app doesn't start:
- Make sure Android emulator is running
- Check that `npm install` completed successfully
- Try clearing cache: `npx expo start -c`

### If you see TypeScript errors:
- Run `npx tsc --noEmit` to check for type errors
- Make sure all dependencies are installed: `npm install`

### If navigation doesn't work:
- Check that all screen files exist in `app/screens/`
- Verify `app/navigation/AppNavigator.tsx` imports are correct

## Current Status

✅ Project foundation complete  
✅ TypeScript types defined  
✅ Zustand stores created  
✅ Navigation structure set up  
✅ All screens created (placeholders)  
✅ Theme configured  

## Next Steps

After verifying the app runs:
- Chunk 4: Receipt Upload Flow
- Chunk 5: Receipt History
- Continue with remaining features...
