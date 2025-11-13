# Production Build Guide

This guide covers building and deploying MyMotivFitX for iOS and Android production environments.

## Prerequisites

1. **EAS CLI**: Install the Expo Application Services CLI
   ```bash
   npm install -g eas-cli
   ```

2. **EAS Account**: Login to your EAS account
   ```bash
   eas login
   ```

3. **Environment Variables**: Ensure the following secrets are configured in EAS:
   - `RORK_AUTH_TOKEN` - Required for accessing Rork private registry

## Building for Production

### iOS Production Build

Build for App Store distribution:

```bash
eas build --platform ios --profile production
```

**Configuration Details:**
- Bundle Identifier: `app.rork.MyMotivFitX-sjp96bi`
- Version: 1.0.2
- Build Number: 4
- Resource Class: Large (for faster builds)
- Build Configuration: Release

**Requirements:**
- Apple Developer Account
- App Store Connect credentials
- Proper provisioning profiles (handled by EAS)

### Android Production Build

Build APK for production:

```bash
eas build --platform android --profile production
```

**Configuration Details:**
- Package Name: `app.rork.mymotivfitx_sjp96bi`
- Version: 1.0.2
- Version Code: 2
- Resource Class: Medium
- Build Type: APK

**Requirements:**
- Google Play Developer Account
- Upload key/keystore (managed by EAS)

### Build Both Platforms

```bash
eas build --platform all --profile production
```

## Build Profiles

The app includes multiple build profiles in `eas.json`:

### 1. **production** (Default for App Store/Play Store)
- Production-ready builds
- Channel: `production`
- NODE_ENV: `production`
- Optimized for size and performance

### 2. **preview** (Internal Testing)
- Internal distribution
- Channel: `preview`
- For TestFlight and Google Play Internal Testing

### 3. **development** (Development Client)
- Development builds with dev client
- Channel: `development`
- For testing with custom native code

### 4. **internal** (Quick Internal Builds)
- Fast internal distribution
- For team testing

## Submitting to Stores

### Submit to Apple App Store

1. **Build the iOS app** (if not already done):
   ```bash
   eas build --platform ios --profile production
   ```

2. **Submit to App Store**:
   ```bash
   eas submit --platform ios --profile production
   ```

You'll be prompted to:
- Select the build to submit
- Provide Apple ID credentials
- Confirm App Store Connect details

### Submit to Google Play Store

1. **Build the Android app** (if not already done):
   ```bash
   eas build --platform android --profile production
   ```

2. **Submit to Google Play**:
   ```bash
   eas submit --platform android --profile production
   ```

You'll need:
- Google Service Account JSON key
- Proper Play Store setup

## Environment Configuration

The app uses the following environment variables:

### Required for Production:
- `EXPO_PUBLIC_RORK_API_BASE_URL` - Backend API URL (configured in app.json)
- `RORK_AUTH_TOKEN` - Private registry access (EAS secret)

### Optional (for enhanced features):
- `EXPO_PUBLIC_SENTRY_DSN` - Error tracking with Sentry
- `SENTRY_DSN` - Backend error tracking

See `.env.example` for the complete list.

## Version Management

Before each production build, update:

1. **app.json**:
   - `version` - Semantic version (e.g., 1.0.3)
   - `ios.buildNumber` - Increment for each iOS build
   - `android.versionCode` - Increment for each Android build

2. **iOS Info.plist** (auto-synced via EAS):
   - `CFBundleShortVersionString` - Matches `version`
   - `CFBundleVersion` - Matches `ios.buildNumber`

## Build Features

### Enabled Features:
- ✅ Camera and microphone access
- ✅ Location services (foreground only)
- ✅ Push notifications
- ✅ Health data access (iOS HealthKit)
- ✅ Activity recognition (Android)
- ✅ Maps integration (Google Maps)

### Permissions Requested:
- **iOS**: Camera, Microphone, Location (when in use), Health data
- **Android**: Camera, Audio recording, Location, Activity recognition, Vibration

## Testing Production Builds

### Internal Testing
Use the `preview` profile for internal testing:

```bash
eas build --platform all --profile preview
```

Install via:
- **iOS**: TestFlight
- **Android**: Google Play Internal Testing or direct APK installation

### Development Testing
For development with custom native modules:

```bash
eas build --platform all --profile development
npx expo start --dev-client
```

## Troubleshooting

### Build Fails
1. Check EAS build logs: `eas build:list`
2. View detailed logs for the failed build
3. Verify all secrets are properly configured
4. Ensure `RORK_AUTH_TOKEN` is valid

### Version Conflicts
- Ensure `app.json` and native project versions are in sync
- iOS `buildNumber` must be incremented for each submission
- Android `versionCode` must be incremented for each release

### Asset Issues
- All required assets are in `assets/images/`:
  - `icon.png` - App icon (1024x1024)
  - `adaptive-icon.png` - Android adaptive icon
  - `splash-icon.png` - Splash screen icon
  - `favicon.png` - Web favicon

## CI/CD Integration

The project includes:
- Pre-install hook: `eas-build-pre-install.sh` - Configures npm for private registry
- Node version: 22.11.0 (specified in eas.json)

## App Store Requirements

### iOS App Store
- Privacy policy URL (optional but recommended)
- App description and screenshots
- Age rating
- Export compliance (configured: No encryption)

### Google Play Store
- Content rating
- Privacy policy URL
- Feature graphic and screenshots
- Short and full description

## Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)

## Support

For issues specific to Rork infrastructure:
- Visit [rork.com](https://rork.com)
- Check the main [README.md](./README.md) for general setup

For EAS-specific issues:
- [Expo Forums](https://forums.expo.dev/)
- [Expo Discord](https://chat.expo.dev/)
