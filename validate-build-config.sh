#!/bin/bash

# Build Configuration Validator
# This script validates that all production build configurations are correct

set -e

echo "🔍 Validating MyMotivFitX Production Build Configuration..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check if a file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} File exists: $1"
    else
        echo -e "${RED}✗${NC} Missing file: $1"
        ERRORS=$((ERRORS + 1))
    fi
}

# Function to check if a directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Directory exists: $1"
    else
        echo -e "${RED}✗${NC} Missing directory: $1"
        ERRORS=$((ERRORS + 1))
    fi
}

# Function to check JSON field
check_json_field() {
    local file=$1
    local field=$2
    local expected=$3
    
    if [ -f "$file" ]; then
        local value=$(jq -r "$field" "$file" 2>/dev/null)
        if [ "$value" != "null" ] && [ -n "$value" ]; then
            if [ -z "$expected" ] || [ "$value" == "$expected" ]; then
                echo -e "${GREEN}✓${NC} $file: $field = $value"
            else
                echo -e "${YELLOW}⚠${NC} $file: $field = $value (expected: $expected)"
                WARNINGS=$((WARNINGS + 1))
            fi
        else
            echo -e "${RED}✗${NC} $file: Missing field $field"
            ERRORS=$((ERRORS + 1))
        fi
    fi
}

echo "📁 Checking Required Files..."
check_file "app.json"
check_file "eas.json"
check_file "package.json"
check_file ".gitignore"
check_file "tsconfig.json"
check_file "metro.config.js"
check_file ".env.example"
check_file "PRODUCTION_BUILD.md"
check_file "PREFLIGHT_CHECKLIST.md"
check_file "BUILD_QUICK_START.md"
echo ""

echo "📁 Checking Asset Files..."
check_file "assets/images/icon.png"
check_file "assets/images/adaptive-icon.png"
check_file "assets/images/splash-icon.png"
check_file "assets/images/favicon.png"
echo ""

echo "📁 Checking iOS Configuration..."
check_dir "ios"
check_file "ios/Podfile"
check_file "ios/MyMotivFitX/Info.plist"
check_file "ios/MyMotivFitX/MyMotivFitX.entitlements"
echo ""

echo "📁 Checking Documentation..."
check_file "README.md"
check_file "docs/privacy.html"
check_file "docs/release-checklist.md"
echo ""

echo "🔧 Validating app.json Configuration..."
if [ -f "app.json" ]; then
    check_json_field "app.json" ".expo.name" "MyMotivFitX"
    check_json_field "app.json" ".expo.version"
    check_json_field "app.json" ".expo.ios.bundleIdentifier" "app.rork.MyMotivFitX-sjp96bi"
    check_json_field "app.json" ".expo.ios.buildNumber"
    check_json_field "app.json" ".expo.android.package" "app.rork.mymotivfitx_sjp96bi"
    check_json_field "app.json" ".expo.android.versionCode"
    check_json_field "app.json" ".expo.extra.eas.projectId" "62670bd0-95c7-427c-ae65-eac8d0820dd1"
    
    # Check version consistency
    APP_VERSION=$(jq -r '.expo.version' app.json)
    IOS_BUILD=$(jq -r '.expo.ios.buildNumber' app.json)
    ANDROID_VERSION=$(jq -r '.expo.android.versionCode' app.json)
    
    echo ""
    echo "📊 Current Version Info:"
    echo "   App Version: $APP_VERSION"
    echo "   iOS Build Number: $IOS_BUILD"
    echo "   Android Version Code: $ANDROID_VERSION"
fi
echo ""

echo "🔧 Validating eas.json Configuration..."
if [ -f "eas.json" ]; then
    check_json_field "eas.json" ".build.production"
    check_json_field "eas.json" ".build.preview"
    check_json_field "eas.json" ".build.development"
    check_json_field "eas.json" ".build.production.node" "22.11.0"
    
    echo ""
    echo "📊 EAS Build Profiles:"
    jq -r '.build | keys[]' eas.json | while read profile; do
        echo "   - $profile"
    done
fi
echo ""

echo "🔧 Checking iOS Version Sync..."
if [ -f "ios/MyMotivFitX/Info.plist" ]; then
    IOS_PLIST_VERSION=$(grep -A1 "CFBundleShortVersionString" ios/MyMotivFitX/Info.plist | grep "<string>" | sed 's/.*<string>\(.*\)<\/string>.*/\1/')
    IOS_PLIST_BUILD=$(grep -A1 "CFBundleVersion" ios/MyMotivFitX/Info.plist | grep "<string>" | sed 's/.*<string>\(.*\)<\/string>.*/\1/')
    
    echo "   Info.plist Version: $IOS_PLIST_VERSION"
    echo "   Info.plist Build: $IOS_PLIST_BUILD"
    
    if [ "$APP_VERSION" == "$IOS_PLIST_VERSION" ]; then
        echo -e "${GREEN}✓${NC} Version numbers match"
    else
        echo -e "${YELLOW}⚠${NC} Version mismatch: app.json ($APP_VERSION) vs Info.plist ($IOS_PLIST_VERSION)"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    if [ "$IOS_BUILD" == "$IOS_PLIST_BUILD" ]; then
        echo -e "${GREEN}✓${NC} Build numbers match"
    else
        echo -e "${RED}✗${NC} Build mismatch: app.json ($IOS_BUILD) vs Info.plist ($IOS_PLIST_BUILD)"
        ERRORS=$((ERRORS + 1))
    fi
fi
echo ""

echo "🔧 Checking Component Structure..."
check_file "components/ErrorBoundary.tsx"
check_file "app/_layout.tsx"

if [ -f "app/_layout.tsx" ]; then
    if grep -q "ErrorBoundary" app/_layout.tsx; then
        echo -e "${GREEN}✓${NC} ErrorBoundary is integrated in app/_layout.tsx"
    else
        echo -e "${YELLOW}⚠${NC} ErrorBoundary not found in app/_layout.tsx"
        WARNINGS=$((WARNINGS + 1))
    fi
fi
echo ""

echo "🔐 Checking EAS Secrets..."
if command -v eas &> /dev/null; then
    echo "Checking EAS CLI authentication..."
    if eas whoami &> /dev/null; then
        echo -e "${GREEN}✓${NC} EAS CLI authenticated"
        echo ""
        echo "Configured secrets:"
        eas secret:list 2>/dev/null || echo -e "${YELLOW}⚠${NC} Unable to list secrets (may need to run 'eas login')"
    else
        echo -e "${YELLOW}⚠${NC} Not logged in to EAS. Run 'eas login'"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠${NC} EAS CLI not installed. Run 'npm install -g eas-cli'"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

echo "═══════════════════════════════════════════════════════════"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready for production build.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Review PREFLIGHT_CHECKLIST.md"
    echo "  2. Run: eas build --platform all --profile production"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Validation completed with $WARNINGS warning(s)${NC}"
    echo "  Review warnings above and fix if necessary."
else
    echo -e "${RED}✗ Validation failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo "  Fix errors above before building."
    exit 1
fi
echo "═══════════════════════════════════════════════════════════"
