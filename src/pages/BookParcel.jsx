import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BookParcel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    senderName: user?.name || '',
    senderAddress: '',
    senderPhone: '',
    receiverName: '',
    receiverAddress: '',
    receiverPhone: '',
    type: 'Document',
    weight: 1,
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        sender: { name: formData.senderName, address: formData.senderAddress, phone: formData.senderPhone },
        receiver: { name: formData.receiverName, address: formData.receiverAddress, phone: formData.receiverPhone },
        parcelDetails: { type: formData.type, weight: formData.weight, description: formData.description }
      };

      const { data } = await axios.post('/api/parcels', payload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      alert(`Parcel Booked! Tracking ID: ${data.trackingId}`);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Error booking parcel');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Book a Parcel</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sender Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Sender Details</h2>
            <div>
              <label className="block text-sm text-gray-700">Name</label>
              <input required className="mt-1 w-full px-3 py-2 border rounded" value={formData.senderName} onChange={(e)=>setFormData({...formData, senderName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Address</label>
              <textarea required className="mt-1 w-full px-3 py-2 border rounded" value={formData.senderAddress} onChange={(e)=>setFormData({...formData, senderAddress: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Phone</label>
              <input required className="mt-1 w-full px-3 py-2 border rounded" value={formData.senderPhone} onChange={(e)=>setFormData({...formData, senderPhone: e.target.value})} />
            </div>
          </div>

          {/* Receiver Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Receiver Details</h2>
            <div>
              <label className="block text-sm text-gray-700">Name</label>
              <input required className="mt-1 w-full px-3 py-2 border rounded" value={formData.receiverName} onChange={(e)=>setFormData({...formData, receiverName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Address</label>
              <textarea required className="mt-1 w-full px-3 py-2 border rounded" value={formData.receiverAddress} onChange={(e)=>setFormData({...formData, receiverAddress: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Phone</label>
              <input required className="mt-1 w-full px-3 py-2 border rounded" value={formData.receiverPhone} onChange={(e)=>setFormData({...formData, receiverPhone: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Parcel Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Parcel Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Type</label>
              <select className="mt-1 w-full px-3 py-2 border rounded" value={formData.type} onChange={(e)=>setFormData({...formData, type: e.target.value})}>
                <option>Document</option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Weight (kg)</label>
              <input type="number" required min="0.1" step="0.1" className="mt-1 w-full px-3 py-2 border rounded" value={formData.weight} onChange={(e)=>setFormData({...formData, weight: parseFloat(e.target.value)})} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Description (Optional)</label>
            <input className="mt-1 w-full px-3 py-2 border rounded" value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
          Book Parcel
        </button>
      </form>
    </div>
  );
};

export default BookParcel;
