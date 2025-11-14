# Production Build Guide for Barcode Scanner and Heart Rate Tracker

This guide explains the setup and configuration needed for the barcode scanner and heart rate tracker features to work in production builds.

## Features Overview

### 1. Barcode Scanner (Nutrition Tracking)
- **Platform Support**: iOS, Android, Web (limited)
- **Technology**: expo-camera with barcode scanning
- **Configuration**: Already configured in app.json

### 2. Heart Rate Tracker
- **Platform Support**: iOS (HealthKit), Android (Health Connect), Web (simulated)
- **Technologies**:
  - iOS: Apple HealthKit via react-native-health
  - Android: Google Health Connect via react-native-health-connect
  - Fallback: Camera-based PPG (photoplethysmography) simulation

## Configuration Summary

### iOS (HealthKit)

**Entitlements** (in app.json):
```json
"entitlements": {
  "com.apple.developer.healthkit": true,
  "com.apple.developer.healthkit.access": []
}
```

**Info.plist Keys** (in app.json):
```json
"infoPlist": {
  "NSHealthShareUsageDescription": "Allow $(PRODUCT_NAME) to read your heart rate and health data to track your fitness progress.",
  "NSHealthUpdateUsageDescription": "Allow $(PRODUCT_NAME) to save your workout and health data."
}
```

**Config Plugin**:
The `react-native-health` plugin is added in app.json plugins array with clinical data and background delivery disabled.

### Android (Health Connect)

**Permissions** (in app.json):
```json
"permissions": [
  "android.permission.health.READ_HEART_RATE",
  "android.permission.health.READ_STEPS",
  "android.permission.health.READ_DISTANCE",
  "android.permission.health.READ_TOTAL_CALORIES_BURNED",
  "android.permission.health.WRITE_HEART_RATE"
]
```

**Config Plugin**:
Custom plugin at `plugins/withHealthConnect.js` automatically configures:
- Health Connect permissions in AndroidManifest.xml
- Query package for Health Connect app
- Intent filter for permission rationale

### Barcode Scanner

**Camera Permissions** (already configured):
- iOS: NSCameraUsageDescription
- Android: CAMERA permission

**Config Plugin** (in app.json):
```json
[
  "expo-camera",
  {
    "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
    "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
    "recordAudioAndroid": true
  }
]
```

## Building for Production

### Prerequisites
1. Install EAS CLI:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. Login to your Expo account:
   ```bash
   eas login
   ```

### iOS Build

1. **Build for iOS**:
   ```bash
   eas build --platform ios --profile production
   ```

2. **What happens**:
   - HealthKit entitlements are added to the build
   - Info.plist keys for health permissions are configured
   - react-native-health native module is linked
   - App can request HealthKit permissions at runtime

3. **Testing**:
   - Install the build on a physical iOS device
   - Navigate to Heart Rate screen
   - App will request HealthKit permissions
   - Grant permissions to access real heart rate data
   - Health data badge will appear when connected

### Android Build

1. **Build for Android**:
   ```bash
   eas build --platform android --profile production
   ```

2. **What happens**:
   - Health Connect permissions are added to AndroidManifest.xml
   - Query for Health Connect app is configured
   - Intent filter for permissions rationale is added
   - react-native-health-connect native module is linked

3. **Requirements**:
   - Device must have Android 14+ or Health Connect app installed
   - User must grant Health Connect permissions

4. **Testing**:
   - Install the build on an Android device with Health Connect
   - Navigate to Heart Rate screen
   - App will request Health Connect permissions
   - Grant permissions to access real heart rate data
   - Health data badge will appear when connected

## Development vs Production

### In Expo Go / Development
- Barcode scanner works normally
- Heart rate tracker uses simulated data
- Warning message indicates production build needed for real health data

### In Production Build
- Barcode scanner works normally
- Heart rate tracker can access real health data via HealthKit/Health Connect
- Graceful fallback to camera simulation if health permissions denied
- Green badge appears when health data is connected

## Code Implementation

### Health Service Architecture

1. **Platform-Specific Services**:
   - `lib/healthKit.ts` - iOS HealthKit implementation
   - `lib/healthConnect.ts` - Android Health Connect implementation

2. **Unified Interface**:
   - `lib/healthService.ts` - Platform-agnostic health service
   - Automatically selects correct implementation based on platform

3. **Usage in Heart Rate Screen**:
   ```typescript
   import { healthService } from '@/lib/healthService';
   
   // Initialize
   await healthService.initialize();
   
   // Check availability
   const available = healthService.isAvailable();
   
   // Get latest heart rate
   const hr = await healthService.getLatestHeartRate();
   
   // Save heart rate
   await healthService.saveHeartRateSample(72);
   ```

## Troubleshooting

### iOS Issues

1. **HealthKit not available**:
   - Ensure device is not a simulator (HealthKit requires physical device)
   - Check that entitlements are properly configured
   - Verify Info.plist usage descriptions are present

2. **Permissions not requested**:
   - Check that `healthService.initialize()` is called
   - Verify HealthKit entitlement in build settings

### Android Issues

1. **Health Connect not found**:
   - Install Health Connect app from Play Store (Android 13 and below)
   - Android 14+ has Health Connect built-in

2. **Permissions not working**:
   - Verify custom plugin is in app.json
   - Check that AndroidManifest.xml includes health permissions
   - Ensure queries section includes Health Connect package

### Barcode Scanner Issues

1. **Scanner not working**:
   - Verify camera permissions granted
   - Check that expo-camera plugin is in app.json
   - Ensure device has working camera

## Next Steps

1. **Test on Physical Devices**:
   - iOS device with HealthKit
   - Android device with Health Connect

2. **App Store Submission**:
   - iOS: Ensure HealthKit usage is described in App Store description
   - Android: Declare health data usage in Play Store listing

3. **Analytics**:
   - Track health data connection rate
   - Monitor fallback to camera simulation usage
   - Collect user feedback on accuracy

## Support

For issues or questions:
1. Check Expo documentation: https://docs.expo.dev/
2. react-native-health: https://github.com/agencyenterprise/react-native-health
3. react-native-health-connect: https://github.com/matinzd/react-native-health-connect
