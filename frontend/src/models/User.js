// User model structure for MongoDB
export const UserSchema = {
  _id: 'ObjectId',
  firstName: 'String',
  lastName: 'String', 
  email: 'String',
  phone: 'String',
  password: 'String', // hashed
  createdAt: 'Date',
  updatedAt: 'Date',
  isActive: 'Boolean',
  wallet: {
    balance: 'Number',
    transactions: [{
      type: 'String', // 'credit' | 'debit'
      amount: 'Number',
      description: 'String',
      timestamp: 'Date'
    }]
  }
};

export const createUser = (userData) => ({
  firstName: userData.firstName,
  lastName: userData.lastName,
  email: userData.email,
  phone: userData.phone,
  password: userData.password,
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  wallet: {
    balance: 0,
    transactions: []
  }
});