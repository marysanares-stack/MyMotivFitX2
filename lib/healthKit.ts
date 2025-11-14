import { Platform } from 'react-native';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';

// Define permissions needed for HealthKit
const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
    ],
    write: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
    ],
  },
};

export interface HeartRateSample {
  value: number;
  startDate: string;
  endDate: string;
}

class HealthKitService {
  private initialized = false;

  /**
   * Initialize HealthKit with required permissions
   */
  async initialize(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      console.log('HealthKit is only available on iOS');
      return false;
    }

    return new Promise((resolve) => {
      AppleHealthKit.initHealthKit(permissions, (error: string) => {
        if (error) {
          console.log('HealthKit initialization error:', error);
          this.initialized = false;
          resolve(false);
        } else {
          console.log('HealthKit initialized successfully');
          this.initialized = true;
          resolve(true);
        }
      });
    });
  }

  /**
   * Check if HealthKit is available on this device
   */
  isAvailable(): boolean {
    return Platform.OS === 'ios' && this.initialized;
  }

  /**
   * Get the latest heart rate sample
   */
  async getLatestHeartRateSample(): Promise<HeartRateSample | null> {
    if (!this.isAvailable()) {
      return null;
    }

    return new Promise((resolve) => {
      const options = {
        unit: 'bpm',
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
        endDate: new Date().toISOString(),
        ascending: false,
        limit: 1,
      };

      AppleHealthKit.getHeartRateSamples(
        options,
        (err: Object, results: HealthValue[]) => {
          if (err) {
            console.log('Error getting heart rate:', err);
            resolve(null);
            return;
          }

          if (results && results.length > 0) {
            const sample = results[0];
            resolve({
              value: sample.value,
              startDate: sample.startDate,
              endDate: sample.endDate,
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  /**
   * Get heart rate samples for a time range
   */
  async getHeartRateSamples(
    startDate: Date,
    endDate: Date,
    limit: number = 100
  ): Promise<HeartRateSample[]> {
    if (!this.isAvailable()) {
      return [];
    }

    return new Promise((resolve) => {
      const options = {
        unit: 'bpm',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        ascending: false,
        limit,
      };

      AppleHealthKit.getHeartRateSamples(
        options,
        (err: Object, results: HealthValue[]) => {
          if (err) {
            console.log('Error getting heart rate samples:', err);
            resolve([]);
            return;
          }

          if (results && results.length > 0) {
            resolve(
              results.map((sample) => ({
                value: sample.value,
                startDate: sample.startDate,
                endDate: sample.endDate,
              }))
            );
          } else {
            resolve([]);
          }
        }
      );
    });
  }

  /**
   * Get resting heart rate
   */
  async getRestingHeartRate(): Promise<number | null> {
    if (!this.isAvailable()) {
      return null;
    }

    return new Promise((resolve) => {
      const options = {
        unit: 'bpm',
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
      };

      AppleHealthKit.getRestingHeartRate(
        options,
        (err: Object, results: HealthValue[]) => {
          if (err) {
            console.log('Error getting resting heart rate:', err);
            resolve(null);
            return;
          }

          if (results && results.length > 0) {
            resolve(results[0].value);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  /**
   * Save a heart rate sample to HealthKit
   */
  async saveHeartRateSample(value: number, date?: Date): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    return new Promise((resolve) => {
      const options = {
        value,
        startDate: (date || new Date()).toISOString(),
        endDate: (date || new Date()).toISOString(),
      };

      AppleHealthKit.saveHeartRateSample(
        options,
        (err: Object, result: string) => {
          if (err) {
            console.log('Error saving heart rate:', err);
            resolve(false);
            return;
          }
          console.log('Heart rate saved:', result);
          resolve(true);
        }
      );
    });
  }
}

// Export singleton instance
export const healthKitService = new HealthKitService();
