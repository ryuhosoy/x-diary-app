export const ACCOUNT_SETTINGS_REQUIRED_FIELDS = [
  'name',
  'description',
  'targetAudience',
  'expertise',
  'tone',
  'topics',
] as const;

export type AccountSettingsKey = (typeof ACCOUNT_SETTINGS_REQUIRED_FIELDS)[number];

/**
 * Validates account settings. Returns the first missing field name or null if valid.
 */
export function validateAccountSettings(
  data: Record<string, unknown>
): { valid: true } | { valid: false; field: string } {
  for (const field of ACCOUNT_SETTINGS_REQUIRED_FIELDS) {
    const value = data[field];
    if (typeof value !== 'string' || !value.trim()) {
      return { valid: false, field };
    }
  }
  return { valid: true };
}
