// Token generation utility
export const generateRechargeToken = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RCH${timestamp}${random}`;
};

export const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TXN${timestamp}${random}`;
};

export const generateReferenceNumber = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `REF${timestamp}${random}`;
};