import { describe, it, expect } from 'vitest';
import {
  validateAccountSettings,
  ACCOUNT_SETTINGS_REQUIRED_FIELDS,
} from './validation';

describe('validateAccountSettings', () => {
  const validSettings = {
    name: 'Engineer Bot',
    description: 'Tech tips',
    targetAudience: 'Developers',
    expertise: 'Frontend',
    tone: 'Casual',
    topics: 'React, TypeScript',
  };

  it('returns valid when all required fields are non-empty strings', () => {
    expect(validateAccountSettings(validSettings)).toEqual({ valid: true });
  });

  it('returns invalid when a required field is missing', () => {
    const result = validateAccountSettings({});
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.field).toBe('name');
    }
  });

  it('returns invalid when a field is empty string', () => {
    const result = validateAccountSettings({
      ...validSettings,
      tone: '',
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.field).toBe('tone');
    }
  });

  it('returns invalid when a field is only whitespace', () => {
    const result = validateAccountSettings({
      ...validSettings,
      topics: '   ',
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.field).toBe('topics');
    }
  });

  it('checks fields in order (first invalid wins)', () => {
    expect(validateAccountSettings({})).toEqual({ valid: false, field: 'name' });
    expect(
      validateAccountSettings({
        name: 'x',
        description: 'x',
        targetAudience: 'x',
        expertise: 'x',
        tone: 'x',
        topics: '',
      })
    ).toEqual({ valid: false, field: 'topics' });
  });

  it('required fields list matches validation', () => {
    expect(ACCOUNT_SETTINGS_REQUIRED_FIELDS).toHaveLength(6);
    expect(ACCOUNT_SETTINGS_REQUIRED_FIELDS).toContain('name');
    expect(ACCOUNT_SETTINGS_REQUIRED_FIELDS).toContain('topics');
  });
});
