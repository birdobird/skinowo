import React, { useState } from 'react';
import skinportService from '../../services/skinportService';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const AdminPriceUpdater: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{ success: boolean; message: string; totalSkins: number } | null>(null);
  const { user } = useAuth();

  // Check if the user is an admin (this should match the backend logic)
  const isAdmin = user && import.meta.env.VITE_ADMIN_IDS?.split(',').includes(user.steamId);

  const updatePrices = async () => {
    try {
      setLoading(true);
      const updateResult = await skinportService.updateAllPrices();
      setResult(updateResult);
      
      if (updateResult.success) {
        toast.success(`Successfully updated prices for ${updateResult.totalSkins} skins`);
      } else {
        toast.error('Failed to update prices');
      }
    } catch (error) {
      console.error('Error updating prices:', error);
      toast.error('An error occurred while updating prices');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null; // Don't render anything for non-admin users
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Update Skin Prices</h3>
        <p className="text-gray-600 mb-3">
          Fetch the latest prices from Skinport and update all skins in the database.
        </p>
        
        <button
          onClick={updatePrices}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating Prices...
            </span>
          ) : (
            'Update Prices from Skinport'
          )}
        </button>
      </div>
      
      {result && (
        <div className={`mt-4 p-3 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-medium">{result.message}</p>
          {result.success && (
            <p className="text-sm mt-1">
              Updated {result.totalSkins} skins with the latest prices from Skinport.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPriceUpdater;
