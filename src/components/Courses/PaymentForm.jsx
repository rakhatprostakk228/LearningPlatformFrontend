import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = ({ course, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`/api/courses/${course._id}/payment`, {
        status: 'completed'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при оплате');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-[90%]">
        <h2 className="text-2xl font-bold mb-4">Оплата курса</h2>
        <p className="mb-4">
          <span className="font-medium">Курс:</span> {course.title}
          <br />
          <span className="font-medium">Стоимость:</span> ${course.price}
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Обработка...' : 'Оплатить'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-300 p-2 rounded hover:bg-gray-50"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;