import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { useLanguage } from '../../context/LanguageContext';

interface Ticket {
  _id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  subject: string;
  status: 'open' | 'closed';
  lastMessage: string;
  messagesCount: number;
  createdAt: string;
  updatedAt: string;
}

const Tickets = () => {
  // const { t } = useLanguage();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);

  // Fetch tickets on component mount and when filters or page changes
  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call with filters
        // For now, we'll simulate it with a timeout and mock data
        setTimeout(() => {
          const mockTickets: Ticket[] = Array.from({ length: 20 }, (_, i) => ({
            _id: `ticket${i + 1 + (currentPage - 1) * 20}`,
            userId: `user${Math.floor(Math.random() * 10) + 1}`,
            username: `SteamUser${Math.floor(Math.random() * 100) + 1}`,
            avatarUrl: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
            subject: [
              'Problem z płatnością',
              'Nie otrzymałem pieniędzy',
              'Jak zmienić metodę płatności?',
              'Błąd przy wysyłaniu skinów',
              'Pytanie o prowizję',
              'Nie mogę zalogować się przez Steam',
              'Jak długo trwa realizacja?'
            ][Math.floor(Math.random() * 7)],
            status: Math.random() > 0.3 ? 'open' : 'closed',
            lastMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
            messagesCount: Math.floor(Math.random() * 10) + 1,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString()
          }));
          
          // Apply filters (in a real app, this would be done server-side)
          let filtered = [...mockTickets];
          
          if (filters.status) {
            filtered = filtered.filter(t => t.status === filters.status);
          }
          
          if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            filtered = filtered.filter(t => new Date(t.createdAt) >= fromDate);
          }
          
          if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999); // End of the day
            filtered = filtered.filter(t => new Date(t.createdAt) <= toDate);
          }
          
          setTickets(filtered);
          setTotalPages(5); // Mock total pages
          setTotalTickets(100); // Mock total tickets
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [currentPage, filters]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      dateFrom: '',
      dateTo: ''
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
                    <th className="px-6 py-3 font-medium">ID</th>
                    <th className="px-6 py-3 font-medium">Użytkownik</th>
                    <th className="px-6 py-3 font-medium">Temat</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Wiadomości</th>
                    <th className="px-6 py-3 font-medium">Data utworzenia</th>
                    <th className="px-6 py-3 font-medium">Ostatnia aktywność</th>
                    <th className="px-6 py-3 font-medium">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="px-6 py-4 text-sm">#{ticket._id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={ticket.avatarUrl} 
                            alt={ticket.username} 
                            className="w-8 h-8 rounded-full"
                          />
                          <Link 
                            to={`/admin/users/${ticket.userId}`}
                            className="hover:text-[var(--btnColor)] hover:underline"
                          >
                            {ticket.username}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{ticket.subject}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          ticket.status === 'open' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {ticket.status === 'open' ? 'Otwarte' : 'Zamknięte'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{ticket.messagesCount}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{formatDate(ticket.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{formatDate(ticket.updatedAt)}</td>
                      <td className="px-6 py-4 text-sm">
                        <Link 
                          to={`/admin/tickets/${ticket._id}`}
                          className="text-[var(--btnColor)] hover:underline"
                        >
                          {ticket.status === 'open' ? 'Odpowiedz' : 'Zobacz'}
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
