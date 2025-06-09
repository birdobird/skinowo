import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/adminAPI';
import { toast } from 'react-toastify';

interface Message {
  id: number;
  content: string;
  isAdmin: boolean;
  createdAt: string;
  user?: {
    id: number;
    displayName: string;
    avatarUrl: string;
    isAdmin: boolean;
  };
}

interface Ticket {
  id: number;
  userId: number;
  user: {
    id: number;
    displayName: string;
    avatarUrl: string;
    steamId: string;
  };
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface Filters {
  status: string;
  priority: string;
  dateFrom: string;
  dateTo: string;
  search: string;
}

const Tickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    status: '',
    priority: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const limit = 20;

  // Fetch tickets on component mount and when filters or page changes
  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const response = await adminAPI.getTickets(
          currentPage,
          limit,
          filters.status || undefined
        );

        console.log(response);
        
        // Check if response has data and pagination info
        if (response && response.success) {
          setTickets(response.tickets || []);
          setTotalPages(response.pagination?.pages || 1);
          setTotalTickets(response.pagination?.total || (response.tickets ? response.tickets.length : 0));
        } else {
          // Fallback in case the response structure is different
          setTickets(Array.isArray(response) ? response : []);
          setTotalPages(1);
          setTotalTickets(Array.isArray(response) ? response.length : 0);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
        toast.error('Wystąpił błąd podczas pobierania zgłoszeń');
        setTickets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [currentPage, filters.status, filters.priority, filters.dateFrom, filters.dateTo, filters.search]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getLastMessagePreview = (ticket: Ticket) => {
    if (!ticket.messages || ticket.messages.length === 0) {
      return 'Brak wiadomości';
    }
    const lastMessage = ticket.messages[ticket.messages.length - 1];
    const content = lastMessage?.content || '';
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high' | 'urgent') => {
    switch (priority) {
      case 'low':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">Niski</span>;
      case 'medium':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500">Średni</span>;
      case 'high':
        return <span className="px-2 py-1 rounded-full text-xs bg-orange-500/20 text-orange-500">Wysoki</span>;
      case 'urgent':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-500">Pilny</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-500">Nieznany</span>;
    }
  };

  const getStatusBadge = (status: 'open' | 'pending' | 'resolved' | 'closed') => {
    switch (status) {
      case 'open':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">Otwarte</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500">W trakcie</span>;
      case 'resolved':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-500">Rozwiązane</span>;
      case 'closed':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-500">Zamknięte</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-500">Nieznany</span>;
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Zgłoszenia</h1>
      </div>

      {/* Filters */}
      <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Filtry</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full bg-[var(--bgColor)] border border-gray-700 rounded-lg p-2 text-sm"
            >
              <option value="">Wszystkie</option>
              <option value="open">Otwarte</option>
              <option value="closed">Zamknięte</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Priorytet</label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="w-full bg-[var(--bgColor)] border border-gray-700 rounded-lg p-2 text-sm"
            >
              <option value="">Wszystkie</option>
              <option value="low">Niski</option>
              <option value="medium">Średni</option>
              <option value="high">Wysoki</option>
              <option value="urgent">Pilny</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Data od</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full bg-[var(--bgColor)] border border-gray-700 rounded-lg p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Data do</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full bg-[var(--bgColor)] border border-gray-700 rounded-lg p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Wyszukaj</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full bg-[var(--bgColor)] border border-gray-700 rounded-lg p-2 text-sm"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            Resetuj filtry
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-[var(--secondaryBgColor)] rounded-xl border border-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-gray-800 bg-gray-800/30">
                    <th className="px-6 py-3 font-medium text-left">ID</th>
                    <th className="px-6 py-3 font-medium text-left">Użytkownik</th>
                    <th className="px-6 py-3 font-medium text-left">Temat</th>
                    <th className="px-6 py-3 font-medium text-left">Ostatnia wiadomość</th>
                    <th className="px-6 py-3 font-medium text-center">Priorytet</th>
                    <th className="px-6 py-3 font-medium text-center">Status</th>
                    <th className="px-6 py-3 font-medium text-center">Data utworzenia</th>
                    <th className="px-6 py-3 font-medium text-center">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="px-6 py-4">
                        <Link 
                          to={`/admin/tickets/${ticket.id}`}
                          className="text-[var(--btnColor)] hover:underline font-mono"
                        >
                          #{ticket.id.toString().padStart(6, '0')}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          to={`/admin/users/${ticket.user.id}`}
                          className="flex items-center space-x-2 group"
                        >
                          <img 
                            src={ticket.user.avatarUrl || '/default-avatar.png'} 
                            alt={ticket.user.displayName}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/default-avatar.png';
                            }}
                          />
                          <div className="flex flex-col">
                            <span className="group-hover:text-[var(--btnColor)] transition-colors">
                              {ticket.user.displayName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {ticket.user.steamId}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{ticket.subject}</div>
                        <div className="text-xs text-gray-400">
                          {ticket.messages?.length || 0} wiadomości
                          {ticket.unreadCount > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 bg-red-900/50 text-red-300 rounded-full text-xs">
                              {ticket.unreadCount} nowych
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                        {getLastMessagePreview(ticket)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getPriorityBadge(ticket.priority)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-400">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link 
                          to={`/admin/tickets/${ticket.id}`}
                          className="text-[var(--btnColor)] hover:underline"
                        >
                          Otwórz
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
              <div className="text-sm text-gray-400">
                Pokazuje {(currentPage - 1) * 20 + 1} - {Math.min(currentPage * 20, totalTickets)} z {totalTickets} zgłoszeń
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === 1
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-[var(--btnColor)] text-black hover:opacity-90'
                  }`}
                >
                  Poprzednia
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === page
                        ? 'bg-[var(--btnColor)] text-black'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === totalPages
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-[var(--btnColor)] text-black hover:opacity-90'
                  }`}
                >
                  Następna
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tickets;
