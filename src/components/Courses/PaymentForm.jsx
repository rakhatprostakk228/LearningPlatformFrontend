import React, { useState } from 'react';

const PaymentForm = ({ course, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    loading: false
  });

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, loading: true }));

    if (formData.cardNumber.replace(/\s/g, '') === '4242424242424242') {
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      alert('Для тестовой оплаты используйте номер: 4242 4242 4242 4242');
      setFormData(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Оплата курса</h2>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-lg font-semibold">{course.title}</p>
          <p className="text-green-600 text-xl">${course.price}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Номер карты
            </label>
            <input
              type="text"
              maxLength="19"
              placeholder="4242 4242 4242 4242"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.cardNumber}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                cardNumber: formatCardNumber(e.target.value)
              }))}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Срок действия
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                maxLength="5"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.expiry}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  expiry: e.target.value
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVC
              </label>
              <input
                type="text"
                placeholder="123"
                maxLength="3"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.cvc}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  cvc: e.target.value.replace(/\D/g, '').slice(0, 3)
                }))}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={formData.loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {formData.loading ? 'Обработка...' : 'Оплатить'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Тестовый номер карты: 4242 4242 4242 4242
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;