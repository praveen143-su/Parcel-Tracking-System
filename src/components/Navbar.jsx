import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiBox, FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <FiBox size={24} />
            <span>SpeedyCourier</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-200">Admin Panel</Link>
                )}
                <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-200" onClick={handleLogout}>
                  <FiLogOut />
                  <span>Logout</span>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
