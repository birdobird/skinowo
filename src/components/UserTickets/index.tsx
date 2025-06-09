import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Support API functions will be added here when needed
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

interface Ticket {
  id?: string;
  _id?: string;
  category: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // For any additional properties that might come from the API
}

const UserTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserTickets = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/support/user/tickets`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include' // Important for sending cookies if using them for auth
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response:', errorData);
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // The backend should return an array of tickets
        if (Array.isArray(data)) {
          setTickets(data);
        } else if (data && Array.isArray(data.tickets)) {
          setTickets(data.tickets);
        } else {
          console.warn('Unexpected response format, setting empty array');
          setTickets([]);
        }
      } catch (err) {
        console.error('Error fetching user tickets:', err);
        setError('Nie udało się pobrać zgłoszeń. Spróbuj ponownie później.');
        toast.error('Nie udało się pobrać zgłoszeń');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTickets();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusLabel = (status: string = 'open') => {
    switch (status) {
      case 'open':
        return 'Otwarte';
      case 'in-progress':
        return 'W trakcie';
      case 'resolved':
        return 'Rozwiązane';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string = 'open') => {
    switch (status) {
      case 'open':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-500';
      case 'resolved':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-center">
        <p className="text-red-300">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-[var(--btnColor)] text-black px-4 py-1 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          Odśwież
        </button>
      </div>
    );
  }

  // Ensure tickets is always an array
  const safeTickets = Array.isArray(tickets) ? tickets : [];

  // Show loading state while checking tickets
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
      </div>
    );
  }

  // Show error if there's an error
  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-center">
        <p className="text-red-300">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-[var(--btnColor)] text-black px-4 py-1 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          Odśwież
        </button>
      </div>
    );
  }

  if (safeTickets.length === 0) {
    return (
      <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 text-center">
        <p className="text-gray-400 mb-4">Nie masz jeszcze żadnych zgłoszeń.</p>
        <Link 
          to="/support"
          className="bg-[var(--btnColor)] text-black px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity inline-block"
        >
          Utwórz zgłoszenie
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--secondaryBgColor)] rounded-xl border border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 text-sm border-b border-gray-800 bg-gray-800/30">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Temat</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Data utworzenia</th>
              <th className="px-4 py-3 font-medium">Ostatnia aktualizacja</th>
              <th className="px-4 py-3 font-medium">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {safeTickets.filter(ticket => ticket?.id || ticket?._id).map((ticket) => {
              // Use either id or _id depending on what the API returns
              const ticketId = ticket.id || ticket._id;
              return (
                <tr key={ticketId} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-sm">#{String(ticketId).slice(-6)}</td>
                  <td className="px-4 py-3 text-sm">{ticket.subject || 'Brak tematu'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(ticket.status)}`}>
                      {getStatusLabel(ticket.status || 'open')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {ticket.createdAt ? formatDate(ticket.createdAt) : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {ticket.updatedAt ? formatDate(ticket.updatedAt) : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link 
                      to={`/support/ticket/${ticketId}`}
                      className="text-[var(--btnColor)] hover:underline"
                    >
                      Zobacz
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTickets;
