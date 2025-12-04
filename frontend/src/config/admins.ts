// Admin configuration for Preshot platform
// Add wallet addresses here to grant admin access

export const ADMIN_ADDRESSES = [
  '0xe099fa204938657fd6f81671d1f7d14ec669b24d', // Primary admin
  // Add more admin addresses below:
  // '0x...', 
];

/**
 * Check if a wallet address has admin privileges
 * @param address - Wallet address to check
 * @returns true if address is in admin list
 */
export const isAdmin = (address: string | undefined): boolean => {
  if (!address) return false;
  const normalizedAddress = address.toLowerCase();
  return ADMIN_ADDRESSES.some(admin => admin.toLowerCase() === normalizedAddress);
};

/**
 * Get the appropriate dashboard route based on user's admin status
 * @param address - Wallet address
 * @returns Dashboard route path
 */
export const getDashboardRoute = (address: string | undefined): string => {
  return isAdmin(address) ? '/mentors-admin' : '/dashboard';
};
