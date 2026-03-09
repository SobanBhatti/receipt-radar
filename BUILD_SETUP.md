# Build Setup Guide

This document outlines the configuration for building ReceiptRadar for both Android and iOS.

## ✅ app.json Configuration Complete

The `app.json` file has been configured with all necessary permissions and settings for both platforms.

### iOS Configuration

**Bundle Identifier**: `com.receiptradar.app`  
**Build Number**: `1`

**Info.plist Permissions**:
- ✅ Camera (`NSCameraUsageDescription`)
- ✅ Photo Library (`NSPhotoLibraryUsageDescription`)
- ✅ Photo Library Add (`NSPhotoLibraryAddUsageDescription`)
- ✅ Location When In Use (`NSLocationWhenInUseUsageDescription`)
- ✅ Location Always (`NSLocationAlwaysAndWhenInUseUsageDescription`)
- ✅ Document Browser Support (`UISupportsDocumentBrowser`)
- ✅ File Sharing (`UIFileSharingEnabled`)
- ✅ Open Documents In Place (`LSSupportsOpeningDocumentsInPlace`)

### Android Configuration

**Package Name**: `com.receiptradar.app`  
**Version Code**: `1`

**Android Permissions**:
- ✅ Camera (`android.permission.CAMERA`)
- ✅ Record Audio (`android.permission.RECORD_AUDIO`)
- ✅ Read External Storage (`android.permission.READ_EXTERNAL_STORAGE`)
- ✅ Write External Storage (`android.permission.WRITE_EXTERNAL_STORAGE`)
- ✅ Read Media Images (`android.permission.READ_MEDIA_IMAGES`) - Android 13+
- ✅ Fine Location (`android.permission.ACCESS_FINE_LOCATION`)
- ✅ Coarse Location (`android.permission.ACCESS_COARSE_LOCATION`)
- ✅ Background Location (`android.permission.ACCESS_BACKGROUND_LOCATION`)

### Plugins Configured

1. **expo-camera** - Camera access
2. **expo-image-picker** - Gallery and camera access
3. **expo-document-picker** - File picker (iOS Files app)
4. **expo-location** - Location services (⚠️ needs to be installed)

## 📦 Required Assets

Add the following files to the `assets/` directory:

### Required Files:
1. **icon.png** (1024x1024px)
   - App icon for both iOS and Android
   - PNG format
   - Can have transparent or solid background

2. **adaptive-icon.png** (1024x1024px)
   - Android adaptive icon foreground
   - PNG format with transparent background
   - Keep important content within 768x768px center area
   - Background color (#2ecc71) is set in app.json

3. **splash.png** (1242x2436px or any size)
   - Splash screen image
   - Will be scaled to fit
   - Background color (#2ecc71) is set in app.json

## 📝 Next Steps

### Before Building:

1. **Install expo-location** (when ready to use location features):
   ```bash
   npx expo install expo-location
   ```

2. **Add Assets**:
   - Create or add `icon.png` to `assets/` directory
   - Create or add `adaptive-icon.png` to `assets/` directory
   - Create or add `splash.png` to `assets/` directory

3. **Update EAS Project ID** (if using EAS Build):
   - Replace `"your-project-id-here"` in `app.json` with your actual EAS project ID
   - Or remove the `extra.eas` section if not using EAS

### Building for Android:

```bash
npx expo prebuild --clean
npx expo run:android
```

### Building for iOS (on Mac):

```bash
npx expo prebuild --clean
npx expo run:ios
```

## 🔧 Notes

- All permissions have user-friendly descriptions that will be shown in permission dialogs
- Location permissions are configured but `expo-location` package needs to be installed before use
- The app uses portrait orientation only
- Splash screen background color is set to #2ecc71 (primary green)
- Android adaptive icon uses #2ecc71 as background color

## 📱 Platform-Specific Notes

### iOS
- Supports iPad (tablet)
- File picker integrates with iOS Files app
- Location permissions configured for both "when in use" and "always" scenarios

### Android
- Uses adaptive icon (Android 8.0+)
- Includes both legacy storage permissions and Android 13+ media permissions
- Location permissions include background location for future features
