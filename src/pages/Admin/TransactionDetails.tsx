import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface TransactionItem {
  skinId: string;
  name: string;
  wear: string;
  weaponType: string;
  rarity: string;
  marketPrice: number;
  ourPrice: number;
  image: string;
  statTrak: boolean;
  souvenir: boolean;
}

interface TransactionDetails {
  _id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  items: TransactionItem[];
  totalAmount: number;
  paymentMethod: 'bank' | 'paypal' | 'skrill' | 'crypto';
  paymentDetails: string;
  status: 'pending' | 'completed' | 'failed';
  tradeUrl: string;
  tradeConfirmation: boolean;
  createdAt: string;
  completedAt?: string;
  adminNotes?: string;
}

const TransactionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate it with a timeout and mock data
        setTimeout(() => {
          const mockTransaction: TransactionDetails = {
            _id: id || 'transaction1',
            userId: 'user1',
            username: 'SteamUser123',
            avatarUrl: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
            items: [
              {
                skinId: 'skin1',
                name: 'AWP | Asiimov',
                wear: 'Field-Tested',
                weaponType: 'Sniper Rifle',
                rarity: 'Covert',
                marketPrice: 180.50,
                ourPrice: 156.75,
                image: '/src/assets/awp.png',
                statTrak: false,
                souvenir: false
              },
              {
                skinId: 'skin2',
                name: 'Karambit | Fade',
                wear: 'Factory New',
                weaponType: 'Knife',
                rarity: 'Covert',
                marketPrice: 230.00,
                ourPrice: 200.00,
                image: '/src/assets/karambit.png',
                statTrak: false,
                souvenir: false
              }
            ],
            totalAmount: 356.75,
            paymentMethod: 'bank',
            paymentDetails: 'Numer konta: 1234 5678 9012 3456, Nazwa: Jan Kowalski',
            status: 'pending',
            tradeUrl: 'https://steamcommunity.com/tradeoffer/new/?partner=123456&token=abcdef',
            tradeConfirmation: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            adminNotes: 'Użytkownik potwierdził wysłanie skinów. Oczekiwanie na weryfikację.'
          };
          
          setTransaction(mockTransaction);
          setAdminNote(mockTransaction.adminNotes || '');
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching transaction details:', err);
        setIsLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleStatusChange = async (newStatus: 'completed' | 'failed') => {
    setActionType(newStatus === 'completed' ? 'approve' : 'reject');
    setShowConfirmation(true);
  };

  const confirmStatusChange = async () => {
    if (!actionType) return;
    
    setIsUpdating(true);
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        setTransaction(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: actionType === 'approve' ? 'completed' : 'failed',
            completedAt: actionType === 'approve' ? new Date().toISOString() : undefined,
            adminNotes: adminNote
          };
        });
        setShowConfirmation(false);
        setActionType(null);
        setIsUpdating(false);
      }, 1000);
    } catch (err) {
      console.error('Error updating transaction status:', err);
      setIsUpdating(false);
    }
  };

  const saveAdminNotes = async () => {
    setIsUpdating(true);
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        setTransaction(prev => {
          if (!prev) return null;
          return {
            ...prev,
            adminNotes: adminNote
          };
        });
        setIsUpdating(false);
        alert('Notatki zostały zapisane');
      }, 500);
    } catch (err) {
      console.error('Error saving admin notes:', err);
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Transakcja nie znaleziona</h2>
        <p className="mt-2 text-gray-400">Nie znaleziono transakcji o podanym ID.</p>
        <Link to="/admin/transactions" className="mt-4 inline-block bg-[var(--btnColor)] text-black px-4 py-2 rounded-lg">
          Powrót do listy transakcji
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/transactions" className="text-gray-400 hover:text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-2xl font-bold">Szczegóły transakcji #{transaction._id}</h1>
        </div>
        <div className="flex items-center space-x-3">
          {transaction.status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusChange('completed')}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                disabled={isUpdating}
              >
                <span className="material-symbols-outlined">check_circle</span>
                <span>Zatwierdź</span>
              </button>
              <button
                onClick={() => handleStatusChange('failed')}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                disabled={isUpdating}
              >
                <span className="material-symbols-outlined">cancel</span>
                <span>Odrzuć</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          transaction.status === 'completed' 
            ? 'bg-green-500/20 text-green-500' 
            : transaction.status === 'pending'
            ? 'bg-amber-500/20 text-amber-500'
            : 'bg-red-500/20 text-red-500'
        }`}>
          {transaction.status === 'completed' 
            ? 'Zakończona' 
            : transaction.status === 'pending'
            ? 'Oczekująca'
            : 'Anulowana'}
        </span>
        <span className="mx-2 text-gray-400">•</span>
        <span className="text-gray-400">Utworzona: {formatDate(transaction.createdAt)}</span>
        {transaction.completedAt && (
          <>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-400">Zakończona: {formatDate(transaction.completedAt)}</span>
          </>
        )}
      </div>

      {/* Transaction Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info */}
        <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Informacje o użytkowniku</h2>
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src={transaction.avatarUrl} 
              alt={transaction.username} 
              className="w-12 h-12 rounded-full"
            />
            <div>
              <Link 
                to={`/admin/users/${transaction.userId}`}
                className="font-medium hover:text-[var(--btnColor)] hover:underline"
              >
                {transaction.username}
              </Link>
              <p className="text-sm text-gray-400">ID: {transaction.userId}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">Trade URL</p>
              <a 
                href={transaction.tradeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-[var(--btnColor)] hover:underline break-all"
              >
                {transaction.tradeUrl}
              </a>
            </div>
            <div>
              <p className="text-sm text-gray-400">Potwierdzenie wysłania skinów</p>
              <p className="text-sm">{transaction.tradeConfirmation ? 'Tak' : 'Nie'}</p>
            </div>
          </div>
        </div>

        {/* Middle Column - Payment Info */}
        <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Informacje o płatności</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">Metoda płatności</p>
              <p className="capitalize">{transaction.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Szczegóły płatności</p>
              <p className="text-sm whitespace-pre-line">{transaction.paymentDetails}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Kwota całkowita</p>
              <p className="text-xl font-bold text-[var(--btnColor)]">{formatCurrency(transaction.totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Admin Notes */}
        <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Notatki administratora</h2>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            className="w-full h-32 bg-[var(--bgColor)] border border-gray-700 rounded-lg p-3 text-sm resize-none"
            placeholder="Dodaj notatki dotyczące tej transakcji..."
          />
          <button
            onClick={saveAdminNotes}
            className="mt-3 w-full bg-[var(--btnColor)] text-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
            ) : (
              <>
                <span className="material-symbols-outlined mr-2">save</span>
                <span>Zapisz notatki</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Przedmioty ({transaction.items.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                <th className="pb-3 font-medium">Przedmiot</th>
                <th className="pb-3 font-medium">Typ</th>
                <th className="pb-3 font-medium">Rzadkość</th>
                <th className="pb-3 font-medium">Zużycie</th>
                <th className="pb-3 font-medium">Cena rynkowa</th>
                <th className="pb-3 font-medium">Nasza cena</th>
              </tr>
            </thead>
            <tbody>
              {transaction.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 object-contain"
                      />
                      <div>
                        <p className="font-medium">
                          {item.statTrak && <span className="text-orange-500">StatTrak™ </span>}
                          {item.souvenir && <span className="text-yellow-500">Souvenir </span>}
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-400">{item.skinId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">{item.weaponType}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.rarity === 'Covert' 
                        ? 'bg-red-500/20 text-red-500' 
                        : item.rarity === 'Classified'
                        ? 'bg-pink-500/20 text-pink-500'
                        : item.rarity === 'Restricted'
                        ? 'bg-purple-500/20 text-purple-500'
                        : item.rarity === 'Mil-Spec'
                        ? 'bg-blue-500/20 text-blue-500'
                        : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {item.rarity}
                    </span>
                  </td>
                  <td className="py-4">{item.wear}</td>
                  <td className="py-4">{formatCurrency(item.marketPrice)}</td>
                  <td className="py-4 font-medium">{formatCurrency(item.ourPrice)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-700">
                <td colSpan={5} className="py-4 text-right font-medium">Suma:</td>
                <td className="py-4 font-bold text-[var(--btnColor)]">{formatCurrency(transaction.totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {actionType === 'approve' ? 'Zatwierdź transakcję' : 'Odrzuć transakcję'}
            </h3>
            <p className="mb-6">
              {actionType === 'approve' 
                ? 'Czy na pewno chcesz zatwierdzić tę transakcję? Upewnij się, że płatność została zrealizowana.' 
                : 'Czy na pewno chcesz odrzucić tę transakcję? Ta akcja nie może być cofnięta.'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setActionType(null);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                disabled={isUpdating}
              >
                Anuluj
              </button>
              <button
                onClick={confirmStatusChange}
                className={`px-4 py-2 rounded-lg ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } text-white transition-colors flex items-center`}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-2">
                      {actionType === 'approve' ? 'check_circle' : 'cancel'}
                    </span>
                    <span>{actionType === 'approve' ? 'Zatwierdź' : 'Odrzuć'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;
