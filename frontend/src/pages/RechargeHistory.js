import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RechargeHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/recharge/history');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Recharge History</h1>
      
      {history.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-500">No recharge history found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((recharge, index) => (
            <motion.div
              key={recharge._id}
              className="bg-white p-4 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{recharge.planName}</h3>
                  <p className="text-gray-600">{recharge.phoneNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(recharge.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">₹{recharge.amount}</p>
                  <p className="text-sm text-green-500">{recharge.status}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RechargeHistory;