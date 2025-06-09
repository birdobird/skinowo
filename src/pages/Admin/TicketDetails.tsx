import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminAPI } from '../../services/adminAPI';

interface Message {
  id: string | number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string | number;
  isAdmin?: boolean;
  isInitial?: boolean;
}

interface TicketDetails {
  id: string | number;
  subject: string;
  status: string;
  category: string;
  priority: string;
  message: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  userId: string | number;
  email?: string;
  avatarUrl?: string;
  username?: string;
}

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await adminAPI.getTicket(id);
        if (data) {
          setTicket(data);
        } else {
          throw new Error('Nieprawidłowa odpowiedź z serwera');
        }
      } catch (err) {
        console.error('Błąd podczas ładowania zgłoszenia:', err);
        // Handle error (show toast, etc.)
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTicketDetails();
    }
  }, [id]);

  useEffect(() => {
    // Scroll to bottom of messages when they change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticket?.messages]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('pl-PL', options);
  };

  const handleSendReply = async () => {
    if (!replyContent.trim() || !id) return;
    
    setIsSending(true);
    try {
      // Wysyłamy wiadomość (aktualizacja statusu jest teraz w jednym żądaniu)
      await adminAPI.sendTicketMessage(id.toString(), replyContent);
      
      // Odświeżamy dane zgłoszenia
      const response = await adminAPI.getTicket(id.toString());
      
      // Upewniamy się, że mamy obiekt ticket
      if (response) {
        setTicket(response);
        setReplyContent('');
        
        // Przewiń do dołu po wysłaniu wiadomości
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        
        toast.success('Odpowiedź została wysłana');
      }
      } catch (err) {
        console.error('Błąd podczas wysyłania odpowiedzi:', err);
        toast.error('Wystąpił błąd podczas wysyłania odpowiedzi');
      } finally {
        setIsSending(false);
      }
  };

  const updateTicketStatus = async (newStatus: 'open' | 'closed') => {
    if (!id) return;
    
    try {
      await adminAPI.updateTicketStatus(id, newStatus);
      
      // Odśwież dane zgłoszenia
      const response = await adminAPI.getTicket(id);
      
      // Upewniamy się, że mamy obiekt ticket
      if (response) {
        setTicket(response);
        toast.success(`Zgłoszenie zostało ${newStatus === 'open' ? 'otwarte' : 'zamknięte'}`);
      }
    } catch (error) {
      console.error(`Błąd podczas ${newStatus === 'open' ? 'otwierania' : 'zamykania'} zgłoszenia:`, error);
      toast.error(`Wystąpił błąd podczas ${newStatus === 'open' ? 'otwierania' : 'zamykania'} zgłoszenia`);
    }
  };

  const handleCloseTicket = () => updateTicketStatus('closed');
  const handleReopenTicket = () => updateTicketStatus('open');

  if (isLoading || !ticket) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const isCurrentUser = (userId: string | number) => {
    return String(userId) === String(ticket.userId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/admin/tickets" className="text-gray-400 hover:text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-2xl font-bold">Zgłoszenie #{ticket.id}</h1>
        </div>
        <div>
          {ticket.status === 'open' ? (
            <button
              onClick={handleCloseTicket}
              className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <span className="material-symbols-outlined">archive</span>
              <span>Zamknij zgłoszenie</span>
            </button>
          ) : (
            <button
              onClick={handleReopenTicket}
              className="flex items-center space-x-2 bg-[var(--btnColor)] text-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined">unarchive</span>
              <span>Otwórz ponownie</span>
            </button>
          )}
        </div>
      </div>

      {/* Ticket Header */}
      <div className="bg-[var(--secondaryBgColor)] rounded-xl p-6 border border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img 
              src={ticket.avatarUrl} 
              alt={ticket.username} 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <Link 
                to={`/admin/users/${ticket.userId}`}
                className="font-medium hover:text-[var(--btnColor)] hover:underline"
              >
                {ticket.username}
              </Link>
              <p className="text-sm text-gray-400">Utworzono: {formatDate(ticket.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              ticket.status === 'open' 
                ? 'bg-green-500/20 text-green-500' 
                : 'bg-gray-500/20 text-gray-500'
            }`}>
              {ticket.status === 'open' ? 'Otwarte' : 'Zamknięte'}
            </span>
            <span className="text-gray-400">Ostatnia aktualizacja: {formatDate(ticket.updatedAt)}</span>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">{ticket.subject}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-[var(--secondaryBgColor)] rounded-xl border border-gray-800 overflow-hidden">
        <div className="space-y-4 mb-6">
          <h3 className="font-medium">Wiadomości:</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
            {ticket.messages?.map((message: Message, index: number) => (
              <div
                key={`${message.id}-${index}`}
                className={`flex ${isCurrentUser(message.userId) ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3/4 rounded-lg p-4 ${
                    isCurrentUser(message.userId)
                      ? 'bg-blue-100 dark:bg-blue-900 rounded-tr-none'
                      : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(message.createdAt)}
                    {message.isInitial && ' (Początkowa wiadomość)'}
                    {message.isAdmin && ' (Odpowiedź obsługi)'}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Reply Form */}
        <div className="border-t pt-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Wpisz odpowiedź..."
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
              disabled={isSending || ticket.status !== 'open'}
            />
            <button
              onClick={handleSendReply}
              disabled={!replyContent.trim() || isSending || ticket.status !== 'open'}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Wysyłanie...' : 'Wyślij'}
            </button>
          </div>
          {ticket.status !== 'open' && (
            <p className="text-sm text-red-500 mt-2">
              To zgłoszenie jest zamknięte. Nie można dodawać nowych wiadomości.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
