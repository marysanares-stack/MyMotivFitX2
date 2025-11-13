# Pre-Flight Production Build Checklist

Use this checklist before initiating a production build for iOS or Android.

## ✅ Completed Items

### Configuration
- [x] Build number synced between `app.json` (iOS buildNumber: 4) and `ios/MyMotivFitX/Info.plist` (CFBundleVersion: 4)
- [x] Version number consistent (1.0.2) across app.json and Info.plist
- [x] Android versionCode set (2)
- [x] EAS project ID configured: 62670bd0-95c7-427c-ae65-eac8d0820dd1
- [x] Bundle identifiers properly set:
  - iOS: `app.rork.MyMotivFitX-sjp96bi`
  - Android: `app.rork.mymotivfitx_sjp96bi`

### Assets
- [x] App icon present: `assets/images/icon.png` (1024x1024)
- [x] Adaptive icon for Android: `assets/images/adaptive-icon.png`
- [x] Splash screen icon: `assets/images/splash-icon.png`
- [x] Favicon for web: `assets/images/favicon.png`

### Build Profiles (eas.json)
- [x] Production profile configured with proper channels
- [x] Preview profile for internal testing
- [x] Development profile for dev client
- [x] NODE_ENV=production for production builds
- [x] Proper resource classes (Large for iOS production, Medium for Android)

### Code Quality
- [x] ErrorBoundary component integrated in root layout
- [x] Sentry integration configured (optional, requires DSN)
- [x] TypeScript configuration proper
- [x] Metro config optimized

### Permissions & Privacy
- [x] iOS permissions configured in Info.plist:
  - Camera, Microphone, Location, HealthKit
- [x] Android permissions configured in app.json:
  - Camera, Audio, Location, Activity Recognition
- [x] Privacy policy document exists: `docs/privacy.html`
- [x] Export compliance configured (No encryption - ITSAppUsesNonExemptEncryption: false)

### Documentation
- [x] Production build guide created: `PRODUCTION_BUILD.md`
- [x] Environment example file: `.env.example`
- [x] Release checklist exists: `docs/release-checklist.md`

## 📋 Pre-Build Actions (Do These Before Building)

### 1. Version Bump (if releasing new version)
```bash
# Edit app.json:
# - Increment "version" (e.g., 1.0.2 -> 1.0.3)
# - Increment "ios.buildNumber" (e.g., 4 -> 5)
# - Increment "android.versionCode" (e.g., 2 -> 3)
```

### 2. Environment Variables
Ensure these secrets are configured in EAS:
```bash
eas secret:list

# Should show:
# - RORK_AUTH_TOKEN (required for private packages)
# - SENTRY_DSN (optional for error tracking)
```

If missing, create them:
```bash
eas secret:create --name RORK_AUTH_TOKEN --value "your-token" --type string
```

### 3. Git Status
```bash
# Ensure all changes are committed
git status
git add .
git commit -m "Prepare for production build v1.0.2"
git push
```

### 4. Clean Build
```bash
# Clear any cached builds (optional but recommended)
rm -rf node_modules
npm install
# Or with bun:
bun install
```

### 5. Test Locally (if possible)
```bash
# Web preview
npm run start-web

# Or with Expo Go
npm run start
```

## 🚀 Build Commands

### iOS Production Build
```bash
eas build --platform ios --profile production
```

### Android Production Build
```bash
eas build --platform android --profile production
```

### Both Platforms
```bash
eas build --platform all --profile production
```

## 📱 Post-Build Verification

After build completes:

1. **Download and test the build**
   - iOS: Install via TestFlight or direct download
   - Android: Install APK or AAB via Play Console

2. **Smoke Test**
   - [ ] App launches without crashes
   - [ ] Navigate through all main tabs (Home, Activity, Social, Profile)
   - [ ] Test core features:
     - [ ] Heart rate tracking displays properly
     - [ ] Workout tracking works
     - [ ] Hydration tracking persists data
     - [ ] Social features load
     - [ ] Navigation works smoothly
   - [ ] ErrorBoundary doesn't trigger during normal use
   - [ ] API calls work (or fail gracefully offline)

3. **Check Logs**
   ```bash
   # View build logs
   eas build:list
   
   # View specific build details
   eas build:view [BUILD_ID]
   ```

## 🔄 Rollback Plan

If critical issues are found:

1. **Stop Distribution**
   - Remove from TestFlight/Play Console testing track

2. **Apply Hotfix**
   - Fix the issue with minimal changes
   - Bump build numbers (and patch version if needed)
   - Document the fix

3. **Rebuild**
   ```bash
   eas build --platform [ios/android] --profile production
   ```

4. **Communicate**
   - Notify testers
   - Update release notes

## 📋 Store Submission Checklist

Before submitting to App Store or Play Store:

### iOS App Store
- [ ] Screenshots prepared (required sizes for all devices)
- [ ] App description written
- [ ] Keywords selected
- [ ] Age rating completed
- [ ] Privacy policy URL (can use docs/privacy.html hosted version)
- [ ] Support URL
- [ ] Marketing URL (optional)

### Google Play Store
- [ ] Screenshots prepared (phone, tablet, 7-inch, 10-inch)
- [ ] Feature graphic created
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Privacy policy URL
- [ ] Content rating questionnaire completed

## 🆘 Troubleshooting

### Build fails with "RORK_AUTH_TOKEN not found"
```bash
eas secret:create --name RORK_AUTH_TOKEN --value "your-token"
```

### Build fails with version conflicts
- Check that buildNumber/versionCode is higher than last uploaded build
- Ensure Info.plist matches app.json

### Runtime crashes
- Check Sentry logs (if configured)
- Review crash logs in App Store Connect or Play Console
- Test locally with same build configuration

## 📚 Additional Resources

- [PRODUCTION_BUILD.md](./PRODUCTION_BUILD.md) - Comprehensive build guide
- [docs/release-checklist.md](./docs/release-checklist.md) - Original release checklist
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)

---

**Last Updated**: November 2024  
**Current Version**: 1.0.2  
**Last Build Number**: iOS 4, Android 2
