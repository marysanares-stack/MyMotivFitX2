# Testing Guide

This guide helps you test the features of MyMotivFitX, particularly the barcode scanner and heart rate monitoring.

## Testing Environment

### Expo Go (Recommended for Most Features)
- Download Expo Go from App Store (iOS) or Play Store (Android)
- Scan the QR code when running `npm start` or `bun start`
- Most features work in Expo Go, including the barcode scanner

### Production Build (For Native Features)
- Required for: Real heart rate monitoring, Apple Health/Google Health Connect
- See `PRODUCTION_BUILD_GUIDE.md` for build instructions

## Feature Testing Checklist

### ✅ Barcode Scanner (Food Tracking)

**Location**: Navigation → Nutrition Screen → "Add Food" Button → "Scan" Button

**Test Cases**:

1. **Camera Permission Flow**
   - [ ] First time opening scanner requests camera permission
   - [ ] Accept permission shows camera preview
   - [ ] Deny permission shows appropriate error message

2. **Barcode Scanning Functionality**
   - [ ] Camera preview loads correctly
   - [ ] Flashlight turns on when scanner opens
   - [ ] Scan a food product barcode (EAN13, UPC-A)
   - [ ] App should show "Looking up product..." loading indicator
   - [ ] Product information auto-fills (name, calories, macros)
   - [ ] Close scanner returns to add food modal with data populated

3. **Product Lookup**
   - [ ] Successful scan populates all fields:
     - Food name
     - Calories
     - Protein
     - Carbs
     - Fat
     - Serving size
   - [ ] Product not found shows empty form (allows manual entry)
   - [ ] Network error handles gracefully

4. **Barcode Types Supported**
   - [ ] EAN-13 (European Article Number, 13 digits)
   - [ ] EAN-8 (European Article Number, 8 digits)
   - [ ] UPC-A (Universal Product Code, 12 digits)
   - [ ] UPC-E (Universal Product Code, 6 digits)

5. **Edge Cases**
   - [ ] Scanning same barcode twice
   - [ ] Scanning invalid barcode
   - [ ] Scanning non-food item barcode
   - [ ] Poor lighting conditions
   - [ ] Closing scanner before scan completes

**Test Products** (Common barcodes to test with):
- Coca-Cola: `5449000000996` (EAN-13)
- Cheerios: `016000275256` (UPC-A)
- Snickers Bar: `040000484493` (UPC-A)
- Any packaged food item from your pantry

**Expected Behavior**:
- ✅ Scanner opens with camera preview
- ✅ Flashlight automatically enabled
- ✅ Frame overlay shows scan area
- ✅ Successful scan triggers OpenFoodFacts API lookup
- ✅ Product data auto-fills form fields
- ✅ User can edit data before adding to food log
- ✅ Food appears in appropriate meal section

**Known Limitations**:
- ❌ Does not work on web (camera API not available)
- ⚠️ Product database coverage varies by region
- ⚠️ Some products may not be in OpenFoodFacts database

### ⚠️ Heart Rate Monitoring

**Location**: Navigation → Heart Rate Screen

**Test Cases in Expo Go** (Simulated Data):

1. **Camera Permission Flow**
   - [ ] First time opening requests camera permission
   - [ ] Accept permission shows camera preview
   - [ ] Deny permission shows permission request screen

2. **Scanning Flow (Simulated)**
   - [ ] Camera preview loads
   - [ ] Instruction text visible: "Place your finger over the rear camera and flash"
   - [ ] Warning card indicates simulated data in Expo Go
   - [ ] "Start Scanning" button visible
   - [ ] Click "Start Scanning"
   - [ ] Flashlight turns on
   - [ ] Progress bar animates (0-100%)
   - [ ] Heart icon pulses during scan
   - [ ] Scan completes after 15 seconds
   - [ ] BPM value displays (simulated: typically 60-80 BPM)
   - [ ] Result added to "Recent Measurements"

3. **Expected Behavior in Expo Go**:
   - ✅ UI and animations work correctly
   - ✅ Camera preview displays
   - ✅ Torch/flashlight activates
   - ⚠️ BPM reading is SIMULATED (not real heart rate)
   - ⚠️ Uses mathematical formula, not camera frame analysis

4. **Expected Behavior in Production Build**:
   - ✅ All UI/animations work
   - ✅ Camera captures frame data
   - ✅ Analyzes red channel intensity variations
   - ✅ Real-time heart rate detection via PPG (photoplethysmography)
   - ✅ Accurate BPM measurement

**To Test Real Heart Rate** (Production Build Only):
1. Build production or development client (see PRODUCTION_BUILD_GUIDE.md)
2. Cover rear camera completely with fingertip
3. Ensure flash/torch is on (illuminates finger)
4. Stay still for full 15 seconds
5. BPM should match your actual heart rate (typically 60-100 BPM)

### ✅ Nutrition Tracking

**Test Cases**:

1. **Manual Food Entry**
   - [ ] Click "Add Food" button
   - [ ] Select meal type (Breakfast, Lunch, Dinner, Snack)
   - [ ] Enter food name
   - [ ] Enter calories (required)
   - [ ] Enter macros (optional)
   - [ ] Click "Add Food"
   - [ ] Food appears in selected meal section

2. **Food Display**
   - [ ] Food name displays correctly
   - [ ] Serving size shows
   - [ ] Calories prominent in orange
   - [ ] Macros displayed (P/C/F)
   - [ ] Daily totals update correctly

3. **Daily Goals Progress**
   - [ ] Calories progress bar updates
   - [ ] Macro cards show progress (Protein, Carbs, Fat)
   - [ ] Progress bars fill correctly
   - [ ] Percentage calculations accurate

### ✅ General App Navigation

1. **Tab Navigation**
   - [ ] Home tab works
   - [ ] Activity tab works
   - [ ] Social tab works
   - [ ] Profile tab works

2. **Deep Linking**
   - [ ] All screens accessible via navigation
   - [ ] Back navigation works correctly
   - [ ] Modal screens dismiss properly

## Automated Testing

Currently, this app does not have automated tests. Consider adding:

```bash
# Future: Unit tests
npm test

# Future: E2E tests
npm run e2e
```

## Bug Reporting

If you find issues during testing:

1. **Document**:
   - Device type (iOS/Android)
   - OS version
   - Testing environment (Expo Go vs Production Build)
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/video if possible

2. **Report**:
   - Create GitHub issue
   - Tag with appropriate labels (bug, feature-request, etc.)

## Performance Testing

### Barcode Scanner Performance
- Scan time should be < 2 seconds for clear barcodes
- API lookup should complete in < 5 seconds
- Camera preview should maintain 30 FPS

### Heart Rate Monitoring Performance
- Scan should complete in exactly 15 seconds
- UI should remain responsive during scan
- Progress updates should be smooth (60 FPS animations)

## Security Testing

### Permissions
- [ ] App only requests necessary permissions
- [ ] Permission denials handled gracefully
- [ ] No permission requests on web version

### Data Privacy
- [ ] No sensitive data logged to console in production
- [ ] API keys not exposed in client code
- [ ] User data stored locally (AsyncStorage)

## Accessibility Testing

- [ ] VoiceOver (iOS) / TalkBack (Android) support
- [ ] Sufficient color contrast
- [ ] Touch targets minimum 44x44 points
- [ ] All interactive elements have labels

## Platform-Specific Testing

### iOS Specific
- [ ] Test on iPhone (various models)
- [ ] Test on iPad (if supported)
- [ ] Test with Dynamic Type (text size changes)
- [ ] Test in dark mode
- [ ] Safe area insets handled correctly

### Android Specific
- [ ] Test on various screen sizes
- [ ] Test with different Android versions
- [ ] Test with system navigation (gesture vs buttons)
- [ ] Test in dark mode
- [ ] Hardware back button works correctly

## Production Readiness Checklist

Before submitting to App Store / Play Store:

- [ ] All critical features tested
- [ ] No console errors or warnings
- [ ] Barcode scanner works on multiple devices
- [ ] Heart rate monitoring acknowledged as requiring production build
- [ ] App icon and splash screen configured
- [ ] Privacy policy linked (if collecting data)
- [ ] Terms of service linked (if required)
- [ ] Analytics/crash reporting configured (optional)
- [ ] Push notifications configured (optional)

## Resources

- [Expo Testing Documentation](https://docs.expo.dev/develop/unit-testing/)
- [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [OpenFoodFacts API Documentation](https://wiki.openfoodfacts.org/API)
