export interface UserProfile {
  name: string;
  title: string;
}

const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alex Williamson',
  title: 'Chief Resident'
};

const USER_PROFILE_STORAGE_KEY = 'aura_user_profile';

const toDisplayName = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return DEFAULT_USER_PROFILE.name;

  return trimmed
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

export const deriveNameFromEmail = (email: string) => {
  const localPart = email.trim().split('@')[0] || '';
  return toDisplayName(localPart);
};

export const getUserProfile = (): UserProfile => {
  const raw = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
  if (!raw) return DEFAULT_USER_PROFILE;

  try {
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return {
      name: parsed.name?.trim() || DEFAULT_USER_PROFILE.name,
      title: parsed.title?.trim() || DEFAULT_USER_PROFILE.title
    };
  } catch {
    return DEFAULT_USER_PROFILE;
  }
};

export const setUserProfile = (profile: Partial<UserProfile>) => {
  const existing = getUserProfile();
  const nextProfile: UserProfile = {
    name: profile.name?.trim() || existing.name,
    title: profile.title?.trim() || existing.title
  };

  localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
};
