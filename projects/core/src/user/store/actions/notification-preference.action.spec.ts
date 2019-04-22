import * as fromAction from './notification-preference.action';

describe('Notification Preference Actions', () => {
  describe('LoadNotificationPreferences', () => {
    it('test failed', () => {
      expect(false).toBeTruthy();
    });
    it('should create the action', () => {
      const userId = 'testId';
      const action = new fromAction.LoadNotificationPreferences(userId);
      expect({ ...action }).toEqual({
        type: fromAction.LOAD_NOTIFICATION_PREFERENCES,
        payload: userId,
      });
    });
  });

  describe('LoadNotificationPreferencesFail', () => {
    it('should create the action', () => {
      const error = 'anError';
      const action = new fromAction.LoadNotificationPreferencesFail(error);

      expect({ ...action }).toEqual({
        type: fromAction.LOAD_NOTIFICATION_PREFERENCES_FAIL,
        payload: error,
      });
    });
  });

  describe('LoadNotificationPreferencesSuccess', () => {
    it('should create the action', () => {
      const payload = 'payload';
      const action = new fromAction.LoadNotificationPreferencesSuccess(payload);
      expect({ ...action }).toEqual({
        type: fromAction.LOAD_NOTIFICATION_PREFERENCES_SUCCESS,
        payload: payload,
      });
    });
  });

  describe('UpdateNotificationPreferences', () => {
    it('should create the action', () => {
      const payload = { userId: 'testId', preference: 'preference' };
      const action = new fromAction.UpdateNotificationPreferences(payload);
      expect({ ...action }).toEqual({
        type: fromAction.UPDATE_NOTIFICATION_PREFERENCES,
        payload: payload,
      });
    });
  });

  describe('UpdateNotificationPreferencesFail', () => {
    it('should create the action', () => {
      const error = 'anError';
      const action = new fromAction.UpdateNotificationPreferencesFail(error);
      expect({ ...action }).toEqual({
        type: fromAction.UPDATE_NOTIFICATION_PREFERENCES_FAIL,
        payload: error,
      });
    });
  });

  describe('UpdateNotificationPreferencesSuccess', () => {
    it('should create the action', () => {
      const payload = 'payload';
      const action = new fromAction.UpdateNotificationPreferencesSuccess(
        payload
      );
      expect({ ...action }).toEqual({
        type: fromAction.UPDATE_NOTIFICATION_PREFERENCES_SUCCESS,
        payload: payload,
      });
    });
  });
});