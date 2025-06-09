import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supportAPI } from '../../services/api';
import { toast } from 'react-toastify';

interface Message {
  adminId?: string;
  message: string;
  createdAt: string;
}

interface TicketDetails {
  _id: string;
  name: string;
  email: string;
  category: string;
  steamId?: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  responses: Message[];
  createdAt: string;
  updatedAt: string;
}

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await supportAPI.getTicketDetails(id);
        
        if (response.success) {
          setTicket(response.ticket);
        } else {
          throw new Error('Failed to fetch ticket details');
        }
      } catch (err) {
        console.error('Error fetching ticket details:', err);
        setError('Nie udało się pobrać szczegółów zgłoszenia. Spróbuj ponownie później.');
        toast.error('Nie udało się pobrać szczegółów zgłoszenia');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  useEffect(() => {
    // Scroll to bottom of messages when they change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticket?.responses]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleSendReply = async () => {
    if (!replyContent.trim() || !id) return;
    
    setIsSending(true);
    try {
      const response = await supportAPI.updateTicket(id, { 
        message: replyContent,
        email: user?.email || ticket?.email // Include email for non-authenticated users
      });
      
      if (response.success) {
        setTicket(response.ticket);
        setReplyContent('');
        toast.success('Odpowiedź wysłana pomyślnie');
      } else {
        throw new Error('Failed to send reply');
      }
    } catch (err) {
      console.error('Error sending reply:', err);
      toast.error('Nie udało się wysłać odpowiedzi. Spróbuj ponownie później.');
    } finally {
      setIsSending(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'payment':
        return 'Płatności';
      case 'trade':
        return 'Handel';
      case 'account':
        return 'Konto';
      case 'technical':
        return 'Problemy techniczne';
      case 'other':
        return 'Inne';
      default:
        return category;
    }
  };

  const getStatusLabel = (status: string) => {
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

  const getStatusClass = (status: string) => {
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--btnColor)]"></div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Link to="/account" className="text-gray-400 hover:text-white mr-4">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-2xl font-bold">Zgłoszenie</h1>
          </div>
          
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-6 text-center">
            <p className="text-red-300 mb-4">{error || 'Nie znaleziono zgłoszenia o podanym ID.'}</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Odśwież
              </button>
              <Link 
                to="/account"
                className="bg-[var(--btnColor)] text-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Wróć do konta
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/account" className="text-gray-400 hover:text-white mr-4">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-2xl font-bold">Zgłoszenie #{ticket._id.slice(-6)}</h1>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(ticket.status)}`}>
            {getStatusLabel(ticket.status)}
          </span>
        </div>
        
        {/* Ticket Header */}
        <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-400">Kategoria</p>
              <p className="font-medium">{getCategoryLabel(ticket.category)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Data utworzenia</p>
              <p className="font-medium">{formatDate(ticket.createdAt)}</p>
            </div>
            {ticket.steamId && (
              <div>
                <p className="text-sm text-gray-400">Steam ID</p>
                <p className="font-medium">{ticket.steamId}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-400">Ostatnia aktualizacja</p>
              <p className="font-medium">{formatDate(ticket.updatedAt)}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Wiadomość</p>
            <div className="bg-[var(--bgColor)] rounded-lg p-4 whitespace-pre-line">
              {ticket.message}
            </div>
          </div>
        </div>
        
        {/* Responses */}
        <div className="bg-[var(--secondaryBgColor)] rounded-xl border border-gray-800 overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold">Odpowiedzi</h2>
          </div>
          
          <div className="p-6 max-h-[400px] overflow-y-auto">
            {ticket.responses.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Brak odpowiedzi</p>
            ) : (
              <div className="space-y-6">
                {ticket.responses.map((response, index) => (
                  <div 
                    key={index} 
                    className={`flex ${!response.adminId || response.adminId === '000000000000000000000000' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[80%] ${!response.adminId || response.adminId === '000000000000000000000000' ? 'bg-gray-700' : 'bg-[var(--btnColor)]/10'} rounded-lg p-4`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">
                          {!response.adminId || response.adminId === '000000000000000000000000' ? 'Ty' : 'Obsługa klienta'}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(response.createdAt)}</span>
                      </div>
                      <p className="whitespace-pre-line">{response.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Reply Form */}
          {ticket.status !== 'resolved' && (
            <div className="p-4 border-t border-gray-800">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full h-32 bg-[var(--bgColor)] border border-gray-700 rounded-lg p-3 text-sm resize-none"
                placeholder="Napisz odpowiedź..."
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleSendReply}
                  disabled={isSending || !replyContent.trim()}
                  className="bg-[var(--btnColor)] text-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined mr-2">send</span>
                      <span>Wyślij odpowiedź</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex justify-center">
          <Link 
            to="/account"
            className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Wróć do konta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
