import { Platform } from 'react-native';
import {
  initialize,
  requestPermission,
  readRecords,
  SdkAvailabilityStatus,
  insertRecords,
} from 'react-native-health-connect';

export interface HeartRateSample {
  value: number;
  startDate: string;
  endDate: string;
}

class HealthConnectService {
  private initialized = false;

  /**
   * Initialize Health Connect
   */
  async initialize(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      console.log('Health Connect is only available on Android');
      return false;
    }

    try {
      // Check if Health Connect is available
      const isAvailable = await initialize();
      
      if (isAvailable === SdkAvailabilityStatus.SDK_AVAILABLE) {
        console.log('Health Connect is available');
        
        // Request permissions
        const grantedPermissions = await requestPermission([
          { accessType: 'read', recordType: 'HeartRate' },
          { accessType: 'read', recordType: 'Steps' },
          { accessType: 'read', recordType: 'Distance' },
          { accessType: 'read', recordType: 'TotalCaloriesBurned' },
          { accessType: 'write', recordType: 'HeartRate' },
        ]);

        console.log('Granted permissions:', grantedPermissions);
        this.initialized = true;
        return true;
      } else {
        console.log('Health Connect SDK not available:', isAvailable);
        this.initialized = false;
        return false;
      }
    } catch (error) {
      console.log('Health Connect initialization error:', error);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Check if Health Connect is available on this device
   */
  isAvailable(): boolean {
    return Platform.OS === 'android' && this.initialized;
  }

  /**
   * Get the latest heart rate sample
   */
  async getLatestHeartRateSample(): Promise<HeartRateSample | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const endTime = new Date().toISOString();

      const result = await readRecords('HeartRate', {
        timeRangeFilter: {
          operator: 'between',
          startTime,
          endTime,
        },
      });

      if (result.records && result.records.length > 0) {
        // Sort by time descending and get the latest
        const sortedRecords = result.records.sort((a: any, b: any) => 
          new Date(b.time).getTime() - new Date(a.time).getTime()
        );
        
        const latest = sortedRecords[0];
        return {
          value: Math.round(latest.beatsPerMinute || 0),
          startDate: latest.time,
          endDate: latest.time,
        };
      }

      return null;
    } catch (error) {
      console.log('Error getting heart rate from Health Connect:', error);
      return null;
    }
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

    try {
      const result = await readRecords('HeartRate', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      if (result.records && result.records.length > 0) {
        // Sort by time descending and limit
        const sortedRecords = result.records
          .sort((a: any, b: any) => 
            new Date(b.time).getTime() - new Date(a.time).getTime()
          )
          .slice(0, limit);
        
        return sortedRecords.map((record: any) => ({
          value: Math.round(record.beatsPerMinute || 0),
          startDate: record.time,
          endDate: record.time,
        }));
      }

      return [];
    } catch (error) {
      console.log('Error getting heart rate samples from Health Connect:', error);
      return [];
    }
  }

  /**
   * Save a heart rate sample to Health Connect
   */
  async saveHeartRateSample(value: number, date?: Date): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const timestamp = (date || new Date()).toISOString();
      
      await insertRecords([
        {
          recordType: 'HeartRate',
          beatsPerMinute: value,
          time: timestamp,
        },
      ]);

      console.log('Heart rate saved to Health Connect');
      return true;
    } catch (error) {
      console.log('Error saving heart rate to Health Connect:', error);
      return false;
    }
  }
}

// Export singleton instance
export const healthConnectService = new HealthConnectService();
