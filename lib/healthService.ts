import { Platform } from 'react-native';
import { healthKitService } from './healthKit';
import { healthConnectService } from './healthConnect';

export interface HeartRateSample {
  value: number;
  startDate: string;
  endDate: string;
}

/**
 * Unified health service that works across iOS (HealthKit) and Android (Health Connect)
 */
class HealthService {
  private initialized = false;

  /**
   * Initialize the appropriate health service for the current platform
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }

    if (Platform.OS === 'ios') {
      this.initialized = await healthKitService.initialize();
    } else if (Platform.OS === 'android') {
      this.initialized = await healthConnectService.initialize();
    }

    return this.initialized;
  }

  /**
   * Check if health data is available on this device
   */
  isAvailable(): boolean {
    if (Platform.OS === 'ios') {
      return healthKitService.isAvailable();
    } else if (Platform.OS === 'android') {
      return healthConnectService.isAvailable();
    }
    return false;
  }

  /**
   * Get the latest heart rate measurement
   */
  async getLatestHeartRate(): Promise<HeartRateSample | null> {
    if (!this.isAvailable()) {
      await this.initialize();
    }

    if (Platform.OS === 'ios') {
      return healthKitService.getLatestHeartRateSample();
    } else if (Platform.OS === 'android') {
      return healthConnectService.getLatestHeartRateSample();
    }
    return null;
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
      await this.initialize();
    }

    if (Platform.OS === 'ios') {
      return healthKitService.getHeartRateSamples(startDate, endDate, limit);
    } else if (Platform.OS === 'android') {
      return healthConnectService.getHeartRateSamples(startDate, endDate, limit);
    }
    return [];
  }

  /**
   * Get resting heart rate (iOS only)
   */
  async getRestingHeartRate(): Promise<number | null> {
    if (!this.isAvailable()) {
      await this.initialize();
    }

    if (Platform.OS === 'ios') {
      return healthKitService.getRestingHeartRate();
    }
    // Android doesn't have a specific resting heart rate concept
    // Could calculate from samples if needed
    return null;
  }

  /**
   * Save a heart rate measurement
   */
  async saveHeartRateSample(value: number, date?: Date): Promise<boolean> {
    if (!this.isAvailable()) {
      await this.initialize();
    }

    if (Platform.OS === 'ios') {
      return healthKitService.saveHeartRateSample(value, date);
    } else if (Platform.OS === 'android') {
      return healthConnectService.saveHeartRateSample(value, date);
    }
    return false;
  }
}

// Export singleton instance
export const healthService = new HealthService();
