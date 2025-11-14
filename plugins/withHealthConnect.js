const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Config plugin to add Health Connect permissions and intent filters to AndroidManifest.xml
 */
const withHealthConnect = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;

    // Add Health Connect permissions
    if (!androidManifest['uses-permission']) {
      androidManifest['uses-permission'] = [];
    }

    const healthPermissions = [
      'android.permission.health.READ_HEART_RATE',
      'android.permission.health.READ_STEPS',
      'android.permission.health.READ_DISTANCE',
      'android.permission.health.READ_TOTAL_CALORIES_BURNED',
      'android.permission.health.WRITE_HEART_RATE',
    ];

    healthPermissions.forEach((permission) => {
      if (
        !androidManifest['uses-permission'].find(
          (p) => p.$['android:name'] === permission
        )
      ) {
        androidManifest['uses-permission'].push({
          $: { 'android:name': permission },
        });
      }
    });

    // Add queries for Health Connect
    if (!androidManifest.queries) {
      androidManifest.queries = [{}];
    }

    if (!androidManifest.queries[0].package) {
      androidManifest.queries[0].package = [];
    }

    const healthConnectPackage = 'com.google.android.apps.healthdata';
    if (
      !androidManifest.queries[0].package.find(
        (p) => p.$['android:name'] === healthConnectPackage
      )
    ) {
      androidManifest.queries[0].package.push({
        $: { 'android:name': healthConnectPackage },
      });
    }

    // Add intent filter for Health Connect
    const mainActivity = androidManifest.application[0].activity.find(
      (activity) =>
        activity.$['android:name'] === '.MainActivity' ||
        activity.$['android:name'] === 'MainActivity'
    );

    if (mainActivity) {
      if (!mainActivity['intent-filter']) {
        mainActivity['intent-filter'] = [];
      }

      const healthConnectIntentExists = mainActivity['intent-filter'].some(
        (filter) =>
          filter.action &&
          filter.action.some(
            (action) =>
              action.$['android:name'] ===
              'androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE'
          )
      );

      if (!healthConnectIntentExists) {
        mainActivity['intent-filter'].push({
          action: [
            {
              $: {
                'android:name':
                  'androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE',
              },
            },
          ],
        });
      }
    }

    return config;
  });
};

module.exports = withHealthConnect;
