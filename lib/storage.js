// LocalStorage utilities for managing download counts

const STORAGE_KEY = 'stream_vault_downloads';
const STORAGE_EXPIRY_KEY = 'stream_vault_downloads_expiry';
const FREE_DOWNLOADS_LIMIT = 3;
const EXPIRY_DAYS = 30; // Reset after 30 days

export const getDownloadCount = () => {
  if (typeof window === 'undefined') return 0;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  const expiry = localStorage.getItem(STORAGE_EXPIRY_KEY);
  const now = new Date().getTime();
  
  // Check if data has expired
  if (expiry && now > parseInt(expiry)) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_EXPIRY_KEY);
    return 0;
  }
  
  return stored ? parseInt(stored) : 0;
};

export const incrementDownloadCount = () => {
  if (typeof window === 'undefined') return;
  
  const current = getDownloadCount();
  const newCount = current + 1;
  const expiryTime = new Date().getTime() + (EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  
  localStorage.setItem(STORAGE_KEY, newCount.toString());
  localStorage.setItem(STORAGE_EXPIRY_KEY, expiryTime.toString());
  
  return newCount;
};

export const canDownloadFree = () => {
  return getDownloadCount() < FREE_DOWNLOADS_LIMIT;
};

export const getRemainingFreeDownloads = () => {
  const count = getDownloadCount();
  return Math.max(0, FREE_DOWNLOADS_LIMIT - count);
};

export const resetDownloadCount = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_EXPIRY_KEY);
};
