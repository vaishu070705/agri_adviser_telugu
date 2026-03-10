// ============================================================
// Alert Service — event-driven engine
// Evaluates rules on every event; stores alerts persistently
// ============================================================

import { AlertItem, EventEntry } from '@/models/types';
import { dataStore } from '@/store/dataStore';

// ---------- alert rules ----------
interface AlertRule {
  eventType: string;
  evaluate: (event: EventEntry) => AlertItem | null;
}

const rules: AlertRule[] = [
  {
    eventType: 'disease_predicted',
    evaluate: (event) => {
      if (event.payload.severity === 'Severe') {
        return {
          id: dataStore.generateId(),
          farmerId: event.farmerId,
          type: 'Disease Alert',
          priority: 'High',
          message: `Severe ${event.payload.disease} detected. Immediate action required.`,
          timestamp: event.timestamp,
          status: 'active',
          triggeredBy: event.id,
        };
      }
      return null;
    },
  },
  {
    eventType: 'yield_predicted',
    evaluate: (event) => {
      if (event.payload.risk === 'High') {
        return {
          id: dataStore.generateId(),
          farmerId: event.farmerId,
          type: 'Yield Alert',
          priority: 'High',
          message: 'Yield risk is HIGH. Expected yield below safe threshold.',
          timestamp: event.timestamp,
          status: 'active',
          triggeredBy: event.id,
        };
      }
      return null;
    },
  },
  {
    eventType: 'crop_predicted',
    evaluate: (event) => {
      if (event.payload.risk === 'High') {
        return {
          id: dataStore.generateId(),
          farmerId: event.farmerId,
          type: 'Crop Risk Alert',
          priority: 'Medium',
          message: `High risk detected for recommended crop ${event.payload.crop}.`,
          timestamp: event.timestamp,
          status: 'active',
          triggeredBy: event.id,
        };
      }
      return null;
    },
  },
  {
    eventType: 'economics_calculated',
    evaluate: (event) => {
      if (event.payload.profitRisk === 'High' || (event.payload.profit as number) < 0) {
        return {
          id: dataStore.generateId(),
          farmerId: event.farmerId,
          type: 'Economics Alert',
          priority: 'High',
          message: `Financial risk detected: ${(event.payload.profit as number) < 0 ? 'Projected loss' : 'High profit risk'}.`,
          timestamp: event.timestamp,
          status: 'active',
          triggeredBy: event.id,
        };
      }
      return null;
    },
  },
  {
    eventType: 'task_completed',
    evaluate: (event) => {
      if (event.payload.success === false) {
        return {
          id: dataStore.generateId(),
          farmerId: event.farmerId,
          type: 'Task Failure',
          priority: 'Medium',
          message: `Worker task "${event.payload.taskTitle}" was marked as failed.`,
          timestamp: event.timestamp,
          status: 'active',
          triggeredBy: event.id,
        };
      }
      return null;
    },
  },
];

// ---------- engine initializer (call once at app start) ----------
let _initialized = false;

export function initAlertEngine(): void {
  if (_initialized) return;
  _initialized = true;

  dataStore.onEvent((event: EventEntry) => {
    rules
      .filter(r => r.eventType === event.type)
      .forEach(r => {
        // Prevent duplicate alerts for the same event
        const existing = dataStore.alerts.find(a => a.triggeredBy === event.id);
        if (existing) return;

        const alert = r.evaluate(event);
        if (alert) dataStore.addAlert(alert);
      });
  });
}

// ---------- query helpers ----------
export function getAlerts(farmerId?: string): AlertItem[] {
  if (farmerId) return dataStore.alerts.filter(a => a.farmerId === farmerId);
  return dataStore.alerts;
}

export function getActiveAlerts(farmerId?: string): AlertItem[] {
  return getAlerts(farmerId).filter(a => a.status === 'active');
}

export function resolveAlert(alertId: string): AlertItem | undefined {
  return dataStore.resolveAlert(alertId);
}

export function getEvents() {
  return dataStore.events;
}
