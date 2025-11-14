# Pre-Production Build Checklist

## ✅ Configuration Complete
- [x] expo-camera plugin configured for barcode scanning
- [x] Camera permissions (iOS & Android)
- [x] HealthKit entitlements (iOS)
- [x] Health usage descriptions (iOS)
- [x] react-native-health plugin (iOS)
- [x] Health Connect permissions (Android - READ & WRITE)
- [x] withHealthConnect custom plugin (Android)
- [x] Health services implemented (cross-platform)

## ✅ Code Quality
- [x] All health service files created
- [x] UI updated with health data integration
- [x] TypeScript properly typed
- [x] No security vulnerabilities (CodeQL: 0 alerts)

## ✅ Documentation
- [x] Production build guide created
- [x] Implementation summary provided
- [x] Inline code documentation

## 📋 Pre-Build Steps (Required Before Running EAS Build)

### 1. Install Dependencies (if not already done)
```bash
npm install
```

### 2. Verify Configuration
```bash
node -e "require('./app.json')"  # Should not error
```

### 3. Clean Build Cache (Recommended)
```bash
rm -rf node_modules/.cache
rm -rf .expo
```

## 🚀 Production Build Commands

### iOS Build
```bash
eas build --platform ios --profile production
```

**What happens:**
- Installs all dependencies including react-native-health
- Applies HealthKit entitlements
- Configures Info.plist permissions
- Links native modules
- Creates production IPA

**Time:** ~15-25 minutes on EAS cloud builders

### Android Build
```bash
eas build --platform android --profile production
```

**What happens:**
- Installs all dependencies including react-native-health-connect
- Applies withHealthConnect config plugin
- Configures AndroidManifest.xml with health permissions
- Links native modules
- Creates production APK/AAB

**Time:** ~10-20 minutes on EAS cloud builders

## 📱 Testing Requirements

### iOS
- Physical iPhone/iPad (iOS 13+)
- Apple Health app configured
- Install build via TestFlight or direct installation
- Grant HealthKit permissions when prompted

### Android
- Physical Android device (Android 13+ recommended)
- Health Connect app installed (or Android 14+ built-in)
- Install APK/AAB
- Grant Health Connect permissions when prompted

## ⚠️ Important Notes

1. **Simulators/Emulators**: Health APIs don't work in simulators. Must test on real devices.

2. **First Build**: May take longer as dependencies are cached for subsequent builds.

3. **RORK_AUTH_TOKEN**: Already configured in eas.json for pre-install hook.

4. **Build Profiles**: Using "production" profile which includes:
   - Node 22.11.0
   - Pre-install script for dependencies
   - Appropriate resource classes (iOS: large, Android: medium)

5. **Barcode Scanner**: Works immediately in production build, no special setup needed.

6. **Heart Rate Tracker**: 
   - Shows health data connection badge when permissions granted
   - Falls back to camera simulation if permissions denied
   - Automatically syncs with Apple Health / Health Connect

## 🔍 Verification Steps After Build

1. Install app on physical device
2. Open Heart Rate screen
3. Check for green badge showing "HealthKit Connected" or "Health Connect Connected"
4. Tap "Get Heart Rate" button
5. Grant health permissions if prompted
6. Verify heart rate is retrieved from health data
7. Check that data appears in Apple Health / Health Connect app
8. Test Barcode Scanner in Nutrition screen
9. Scan a product barcode and verify data lookup works

## 📦 What's Included in Production Build

### Packages
- react-native-health (iOS)
- react-native-health-connect (Android)
- expo-camera (both platforms)
- All existing dependencies

### Native Configurations
- iOS: HealthKit framework linked
- Android: Health Connect permissions in manifest
- Both: Camera permissions configured

### Code
- lib/healthKit.ts (iOS service)
- lib/healthConnect.ts (Android service)
- lib/healthService.ts (unified API)
- plugins/withHealthConnect.js (Android config)
- Updated heart-rate.tsx with health integration

## ✅ Ready to Build!

Everything is configured correctly. You can proceed with:

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

Or build both platforms at once:

```bash
eas build --platform all --profile production
```
