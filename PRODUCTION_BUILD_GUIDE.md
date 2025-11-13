# Production Build Guide

This document outlines which features work in Expo Go vs. require a production build, and provides instructions for creating production builds.

## Features Status

### ✅ Features Working in Expo Go

These features work perfectly in Expo Go without needing a production build:

- **Barcode Scanner for Food Tracking** (`app/nutrition.tsx`)
  - Fully functional barcode scanning using `expo-camera`
  - Integrates with OpenFoodFacts API for automatic nutrition lookup
  - Supports EAN13, EAN8, UPC-A, and UPC-E barcode formats
  - Camera permissions already configured
  - Works on iOS and Android devices (not on web)

- **Basic Camera Access**
  - Photo capture
  - Video recording
  - Camera permissions

- **Location Services**
  - Basic location tracking
  - GPS coordinates
  - Map integration

- **Notifications**
  - Local notifications
  - Scheduled notifications
  - Notification permissions

### ⚠️ Features Requiring Production Build

These features have **simulated/mock implementations** in Expo Go and require a production build to work with real device sensors:

#### 1. Real-Time Heart Rate Monitoring (`app/heart-rate.tsx`)

**Current Status**: Uses simulated data
- Camera preview works
- Flashlight/torch works
- **Frame-by-frame camera data access DOES NOT work** in Expo Go

**Why Production Build is Required**:
- Heart rate detection via photoplethysmography (PPG) requires analyzing the red color channel of each camera frame
- Expo Go does not provide access to raw camera frame data for security and performance reasons
- Production builds can access camera frames through native modules or custom camera APIs

**To Enable**:
1. Create a production build with EAS Build (see below)
2. Consider using a native module like:
   - Custom native module for camera frame processing
   - Or alternative: Use expo-gl with camera texture for frame analysis
   - Or alternative: Implement server-side processing with video upload

#### 2. Native Health Platform Integration

**Current Status**: Mock implementation in `HealthSyncContext.tsx`
- Apple Health and Google Health Connect APIs are mocked
- Returns simulated data

**Why Production Build is Required**:
- Apple Health (iOS) and Google Health Connect (Android) require native modules
- These SDKs are platform-specific and cannot run in Expo Go

**To Enable**:
1. Add native health module (e.g., `react-native-health` or custom config plugin)
2. Configure proper entitlements in `app.json` (already partially configured)
3. Create a production build

#### 3. Background Location Tracking

**Current Status**: Foreground location works
- Background location tracking is limited in Expo Go

**To Enable**:
1. Configure background modes in `app.json` (already configured)
2. Create a production build
3. Implement background task handling

## How to Create a Production Build

This app uses **EAS Build** for creating production-ready builds.

### Prerequisites

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to your Expo account
eas login
```

### Build for iOS

```bash
# For testing on physical devices (internal distribution)
eas build --profile internal --platform ios

# For App Store submission
eas build --profile production --platform ios
```

### Build for Android

```bash
# For testing on physical devices (internal distribution)
eas build --profile internal --platform android

# For Google Play Store submission
eas build --profile production --platform android
```

### Development Builds

For features requiring native code access during development:

```bash
# Create a development build
eas build --profile development --platform ios
eas build --profile development --platform android

# Run with development client
npx expo start --dev-client
```

## Implementing Real Heart Rate Detection

To make heart rate monitoring functional in production builds, you have several options:

### Option 1: Custom Native Module (Recommended)

Create a custom native module that processes camera frames:

1. **iOS**: Use AVFoundation to capture video frames and analyze the red channel
2. **Android**: Use Camera2 API to capture frames and process them

**Pros**: Best performance, lowest latency
**Cons**: Requires native iOS/Android development knowledge

### Option 2: Use expo-gl with Camera Texture

Process camera frames using WebGL for frame analysis:

```typescript
import { GLView } from 'expo-gl';
import { Camera } from 'expo-camera';
```

**Pros**: Works with Expo workflow, no native code needed
**Cons**: May have performance limitations

### Option 3: Video Upload + Server Processing

Upload short video clips and process them server-side:

**Pros**: No native code, works everywhere
**Cons**: Requires internet connection, higher latency

## Implementing Apple Health / Google Health Connect

### For iOS (Apple Health)

1. **Add HealthKit Config Plugin**:

```json
// In app.json
{
  "expo": {
    "plugins": [
      [
        "expo-health",
        {
          "healthSharePermission": "Allow MyMotivFitX to read your health data"
        }
      ]
    ]
  }
}
```

2. **Use Native Module**:

```bash
npx expo install expo-health
```

3. **Implement in Code**:

```typescript
import * as ExpoHealth from 'expo-health';

// Request permissions
const { granted } = await ExpoHealth.requestPermissionsAsync({
  read: ['HeartRate', 'Steps', 'ActiveEnergyBurned'],
  write: ['Workout']
});

// Query heart rate data
const heartRateData = await ExpoHealth.queryHealthDataAsync({
  dataType: ExpoHealth.HealthDataTypes.HeartRate,
  startDate: startDate,
  endDate: endDate,
});
```

### For Android (Google Health Connect)

Similar approach using Health Connect SDK through a config plugin.

## Testing Strategy

1. **Expo Go Testing**: Test all UI, navigation, and non-native features
2. **Development Build**: Test native integrations during development
3. **Production Build**: Final testing before store submission

## Current Permissions Configuration

The app already has proper permissions configured in `app.json`:

### iOS Permissions
- ✅ Camera access
- ✅ Location (when in use)
- ✅ HealthKit entitlements (configured)
- ✅ Microphone access

### Android Permissions
- ✅ Camera
- ✅ Location (coarse and fine)
- ✅ Foreground service
- ✅ Activity recognition
- ✅ Vibrate

## Summary

### What Works Now (Expo Go)
- ✅ **Barcode Scanner**: Fully functional for food tracking
- ✅ Basic camera, location, notifications

### What Needs Production Build
- ⚠️ **Heart Rate Monitoring**: Requires camera frame access
- ⚠️ **Apple Health/Google Health Connect**: Requires native health modules
- ⚠️ **Background Location**: Full background tracking

### Next Steps
1. Continue developing and testing in Expo Go for most features
2. Create development builds when you need to test:
   - Heart rate monitoring with real camera frames
   - Health platform integration
3. Create production builds for App Store/Play Store submission

## Resources

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Apple Health Integration](https://developer.apple.com/documentation/healthkit)
- [Google Health Connect](https://developer.android.com/health-and-fitness/guides/health-connect)
