import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface User {
  _id: string;
  steamId: string;
  username: string;
  avatarUrl: string;
  registrationDate: string;
  lastLogin: string;
  tradeUrl: string;
  transactionsCount: number;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch users on component mount and when page changes
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate it with a timeout and mock data
        setTimeout(() => {
          const mockUsers: User[] = Array.from({ length: 20 }, (_, i) => ({
            _id: `user${i + 1 + (currentPage - 1) * 20}`,
            steamId: `7656119812345${i + 1 + (currentPage - 1) * 20}`,
            username: `SteamUser${i + 1 + (currentPage - 1) * 20}`,
            avatarUrl: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
            registrationDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            lastLogin: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
            tradeUrl: `https://steamcommunity.com/tradeoffer/new/?partner=12345${i + 1}&token=abcdef`,
            transactionsCount: Math.floor(Math.random() * 10)
          }));
          
          setUsers(mockUsers);
          setTotalPages(5); // Mock total pages
          setTotalUsers(100); // Mock total users
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching users:', err);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.steamId.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Użytkownicy</h1>
        
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="material-symbols-outlined text-gray-400"><i className="fa-solid fa-magnifying-glass"></i></span>
          </span>
          <input
            type="text"
            className="bg-[var(--secondaryBgColor)] border border-gray-700 text-white text-sm rounded-lg focus:ring-[var(--btnColor)] focus:border-[var(--btnColor)] block w-full min-w-96 pl-10 p-2.5"
            placeholder="Szukaj po nazwie użytkownika lub Steam ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

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
                    <th className="px-6 py-3 font-medium">Użytkownik</th>
                    <th className="px-6 py-3 font-medium">Steam ID</th>
                    <th className="px-6 py-3 font-medium">Data rejestracji</th>
                    <th className="px-6 py-3 font-medium">Ostatnie logowanie</th>
                    <th className="px-6 py-3 font-medium">Transakcje</th>
                    <th className="px-6 py-3 font-medium">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={user.avatarUrl} 
                            alt={user.username} 
                            className="w-8 h-8 rounded-full"
                          />
                          <span>{user.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{user.steamId}</td>
                      <td className="px-6 py-4 text-sm">{formatDate(user.registrationDate)}</td>
                      <td className="px-6 py-4 text-sm">{formatDate(user.lastLogin)}</td>
                      <td className="px-6 py-4 text-sm">{user.transactionsCount}</td>
                      <td className="px-6 py-4 text-sm">
                        <Link 
                          to={`/admin/users/${user._id}`}
                          className="text-[var(--btnColor)] hover:underline mr-4"
                        >
                          Szczegóły
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
                Pokazuje {(currentPage - 1) * 20 + 1} - {Math.min(currentPage * 20, totalUsers)} z {totalUsers} użytkowników
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

export default Users;
