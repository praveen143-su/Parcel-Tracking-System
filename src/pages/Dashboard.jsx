import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [parcels, setParcels] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const { data } = await axios.get('/api/parcels/history', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setParcels(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (user) fetchParcels();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <Link to="/book" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
          Book New Parcel
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {parcels.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">No parcels found. Book one now!</li>
          ) : (
            parcels.map((parcel) => (
              <li key={parcel._id}>
                <Link to={`/track/${parcel.trackingId}`} className="block hover:bg-gray-50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        Tracking ID: {parcel.trackingId}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        To: {parcel.receiver.name} - {parcel.receiver.address}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {parcel.status}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(parcel.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
