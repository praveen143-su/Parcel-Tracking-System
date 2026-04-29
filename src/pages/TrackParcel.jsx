import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import QRCode from 'react-qr-code';

const TrackParcel = () => {
  const { trackingId } = useParams();
  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const { data } = await axios.get(`/api/parcels/track/${trackingId}`);
        setParcel(data);
      } catch (err) {
        setError('Parcel not found or tracking ID is invalid.');
      }
    };
    fetchParcel();

    // Socket.io for real-time updates
    const socket = io();
    socket.emit('joinRoom', trackingId);

    socket.on('statusUpdate', (updatedParcel) => {
      console.log('Socket Update:', updatedParcel);
      setParcel(updatedParcel);
    });

    return () => socket.disconnect();
  }, [trackingId]);

  console.log('Rendering Parcel:', parcel);

  if (error) return <div className="text-center mt-20 text-red-600 text-xl">{error}</div>;
  if (!parcel) return <div className="text-center mt-20 text-xl">Loading tracking details...</div>;

  // Ensure updates exist
  const updates = parcel.updates || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Tracking ID: {parcel.trackingId}</h1>
            <p className="text-blue-100 mt-1">Current Status: <span className="font-bold text-white bg-blue-500 px-2 py-1 rounded">{parcel.status}</span></p>
          </div>
          <div className="bg-white p-2 rounded-lg text-blue-600 font-bold">
             QR Placeholder
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">Sender</h3>
            <p><span className="text-gray-500 text-sm">Name:</span> {parcel.sender.name}</p>
            <p><span className="text-gray-500 text-sm">Address:</span> {parcel.sender.address}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">Receiver</h3>
            <p><span className="text-gray-500 text-sm">Name:</span> {parcel.receiver.name}</p>
            <p><span className="text-gray-500 text-sm">Address:</span> {parcel.receiver.address}</p>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t">
          <h3 className="font-semibold text-gray-700 mb-6">Tracking History</h3>
          <div className="space-y-6">
            {updates.slice().reverse().map((update, idx) => (
              <div key={idx} className="flex relative">
                <div className="flex-shrink-0 w-8 flex flex-col items-center">
                  <div className="h-4 w-4 rounded-full bg-blue-600"></div>
                  {idx !== updates.length - 1 && <div className="h-full w-0.5 bg-gray-300 mt-2"></div>}
                </div>
                <div className="ml-4 mb-4">
                  <h4 className="text-lg font-bold text-gray-900">{update.status}</h4>
                  <p className="text-sm text-gray-500">{new Date(update.timestamp).toLocaleString()}</p>
                  <p className="text-gray-700 mt-1">{update.description} - <span className="italic">{update.location}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackParcel;
