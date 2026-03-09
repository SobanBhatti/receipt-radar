# Assets Directory

This directory contains app icons and splash screen images.

## Required Files

### App Icon
- `icon.png` - 1024x1024px app icon (required for both iOS and Android)
- `adaptive-icon.png` - 1024x1024px adaptive icon for Android (foreground only, transparent background)

### Splash Screen
- `splash.png` - 1242x2436px splash screen image (or any size, will be scaled)

## Image Specifications

### icon.png
- **Size**: 1024x1024px
- **Format**: PNG
- **Background**: Can be transparent or solid color
- **Usage**: iOS App Store and Android Play Store icon

### adaptive-icon.png (Android)
- **Size**: 1024x1024px
- **Format**: PNG
- **Background**: Transparent (will use backgroundColor from app.json)
- **Safe Zone**: Keep important content within 768x768px center area
- **Usage**: Android adaptive icon foreground

### splash.png
- **Size**: 1242x2436px (or any size, will be scaled)
- **Format**: PNG
- **Background**: Will use backgroundColor from app.json (#2ecc71)
- **Usage**: App launch splash screen

## Notes

- All images should be high quality and optimized
- Use the primary color (#2ecc71) for consistency
- The splash screen background color is set to #2ecc71 in app.json
- Adaptive icon foreground should have transparent background

## Generating Assets

You can use tools like:
- [Expo Asset Generator](https://www.npmjs.com/package/expo-asset-generator)
- [App Icon Generator](https://www.appicon.co/)
- Design tools like Figma, Sketch, or Adobe XD
