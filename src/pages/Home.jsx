import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

const Home = () => {
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/track/${trackingId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Track Your Parcel in <span className="text-blue-600">Real-Time</span>
        </h1>
        <p className="text-xl text-gray-600">
          Fast, reliable, and secure courier services at your fingertips.
        </p>
        
        <form onSubmit={handleTrack} className="mt-8 flex max-w-xl mx-auto shadow-xl rounded-full overflow-hidden border border-gray-200 bg-white">
          <input
            type="text"
            className="flex-1 px-6 py-4 outline-none text-lg"
            placeholder="Enter Tracking ID (e.g., TRK123...)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 flex items-center font-bold text-lg transition-colors"
          >
            <FiSearch className="mr-2" /> Track
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
