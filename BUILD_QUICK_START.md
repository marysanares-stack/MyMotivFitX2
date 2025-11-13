# Quick Start: Production Build

This app is ready for production builds on iOS and Android.

## Prerequisites

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to EAS
eas login
```

## Build for Production

### iOS
```bash
eas build --platform ios --profile production
```

### Android
```bash
eas build --platform android --profile production
```

### Both Platforms
```bash
eas build --platform all --profile production
```

## Submit to Stores

### iOS App Store
```bash
eas submit --platform ios --profile production
```

### Android Play Store
```bash
eas submit --platform android --profile production
```

## Testing Builds

### Internal Testing (Preview Build)
```bash
eas build --platform all --profile preview
```

### Development Build (with Dev Client)
```bash
eas build --platform all --profile development
npx expo start --dev-client
```

## Important Notes

1. **Environment Variables**: Ensure `RORK_AUTH_TOKEN` is configured in EAS secrets
   ```bash
   eas secret:list
   # If missing:
   eas secret:create --name RORK_AUTH_TOKEN --value "your-token"
   ```

2. **Version Management**: Before each build, update in `app.json`:
   - `version` (e.g., 1.0.2 → 1.0.3)
   - `ios.buildNumber` (e.g., 4 → 5)
   - `android.versionCode` (e.g., 2 → 3)

3. **Current Version**:
   - Version: 1.0.2
   - iOS Build: 4
   - Android Version Code: 2

## Documentation

- **[PREFLIGHT_CHECKLIST.md](./PREFLIGHT_CHECKLIST.md)** - Complete pre-build checklist
- **[PRODUCTION_BUILD.md](./PRODUCTION_BUILD.md)** - Comprehensive build guide
- **[docs/release-checklist.md](./docs/release-checklist.md)** - Release workflow
- **[README.md](./README.md)** - General project documentation

## Troubleshooting

**Build fails?**
```bash
# Check build status
eas build:list

# View detailed logs
eas build:view [BUILD_ID]
```

**Need help?**
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Expo Forums](https://forums.expo.dev/)
- [Rork Support](https://rork.com)

---

**Ready to build!** 🚀
