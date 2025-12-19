// Recharge model structure for MongoDB
export const RechargeSchema = {
  _id: 'ObjectId',
  userId: 'ObjectId',
  phoneNumber: 'String',
  operator: 'String',
  planId: 'ObjectId',
  amount: 'Number',
  status: 'String', // 'pending' | 'success' | 'failed'
  transactionId: 'String',
  createdAt: 'Date',
  completedAt: 'Date'
};

export const PlanSchema = {
  _id: 'ObjectId',
  name: 'String',
  operator: 'String',
  amount: 'Number',
  validity: 'String',
  data: 'String',
  description: 'String',
  isActive: 'Boolean'
};

export const BillPaymentSchema = {
  _id: 'ObjectId',
  userId: 'ObjectId',
  billType: 'String', // 'electric' | 'water' | 'dth'
  consumerNumber: 'String',
  amount: 'Number',
  status: 'String',
  transactionId: 'String',
  createdAt: 'Date',
  completedAt: 'Date'
};