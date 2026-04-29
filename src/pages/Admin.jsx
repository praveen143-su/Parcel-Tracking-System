import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reports, setReports] = useState(null);
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const reportsRes = await axios.get('/api/admin/reports', config);
        const parcelsRes = await axios.get('/api/admin/parcels', config);
        
        setReports(reportsRes.data);
        setParcels(parcelsRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [user, navigate]);

  const updateStatus = async (parcelId, newStatus) => {
    const location = prompt('Enter current location (e.g., Warehouse A):') || 'System';
    const description = prompt('Enter update description:') || `Status updated to ${newStatus}`;
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/admin/parcels/${parcelId}/status`, {
        status: newStatus, location, description
      }, config);
      
      // Update local state
      setParcels(parcels.map(p => p._id === parcelId ? { ...p, status: newStatus } : p));
      // Optionally refresh reports
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const chartData = reports ? [
    { name: 'Pending', count: reports.pending },
    { name: 'In Transit', count: reports.inTransit },
    { name: 'Delivered', count: reports.delivered },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Reports Section */}
      {reports && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium">Total Parcels</h3>
            <p className="text-3xl font-bold text-gray-900">{reports.totalParcels}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
            <p className="text-3xl font-bold text-gray-900">{reports.pending}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium">Delivered</h3>
            <p className="text-3xl font-bold text-gray-900">{reports.delivered}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-purple-500">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{reports.usersCount}</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="bg-white shadow rounded-lg p-6 mb-12 h-80">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Parcel Status Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Parcels Management Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">Manage Parcels</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <a href={`/track/${parcel.trackingId}`} target="_blank" rel="noreferrer">{parcel.trackingId}</a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcel.sender.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcel.receiver.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {parcel.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select 
                      className="border rounded p-1"
                      value={parcel.status}
                      onChange={(e) => updateStatus(parcel._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Picked Up">Picked Up</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
