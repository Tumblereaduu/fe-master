import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Paperclip, SendHorizontal, X, MessageCircle, Loader, Lock, LockOpen, CheckCheck } from 'lucide-react';
import { BACKEND_API_URL } from '../../api/config';

// Helper to get current admin info from token
// Standardized Frontend Helper
const getAdminInfo = () => {
  try {
    // 1. Check 'admin' object (usually in AdminDeposit.jsx)
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      const parsed = JSON.parse(adminData);
      return { 
        admin_id: parsed.id || null, 
        admin_name: parsed.admin_name || parsed.name || null 
      };
    }
    
    // 2. Check Token (for other pages)
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      return {
        admin_id: payload.id || null,
        admin_name: payload.name || payload.admin_name || payload.username || null
      };
    }
  } catch (e) {
    console.log("Could not parse admin info", e);
  }
  return { admin_id: null, admin_name: null };
};

const Reply = ({ ticket, setTickets, onclose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [chatEnded, setChatEnded] = useState(ticket?.chat_ended === 'yes');
  const [showEndChatModal, setShowEndChatModal] = useState(false);
  const [endingChat, setEndingChat] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const intervalRef = useRef(null);
  const messagesRef = useRef([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!ticket?.ticket_id) return

    setChatEnded(ticket?.chat_ended === 'yes')
    fetchMessages()
    intervalRef.current = window.setInterval(refreshMessages, 5000)

    return () => {
      window.clearInterval(intervalRef.current)
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [ticket?.ticket_id])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
      if (!ticket?.ticket_id) return;

      const markAsSeen = async () => {
          try {
              await axios.put(
                  `${BACKEND_API_URL}/support/messages/seen/${ticket.ticket_id}`
              );
          } catch (err) {
              console.error(err);
          }
      };

      markAsSeen();
  }, [ticket?.ticket_id]);

  const getMessageImageSrc = (src) => {
    if (!src) return null
    if (src.startsWith('http') || src.startsWith('blob:')) return src
    return `${BACKEND_API_URL}/${src}`
  }

  const fetchMessages = async () => {
    if (!ticket?.ticket_id) return

    try {
      setLoading(true)
      const response = await axios.get(`${BACKEND_API_URL}/support/messages/${ticket.ticket_id}`)
      const data = response.data

      let fetchedMessages = []
      if (Array.isArray(data)) {
        fetchedMessages = data
      } else if (Array.isArray(data.data)) {
        fetchedMessages = data.data
      } else if (Array.isArray(data.messages)) {
        fetchedMessages = data.messages
      }

      fetchedMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      setMessages(fetchedMessages)
      scrollToBottom()
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load conversation')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  // const refreshMessages = async () => {
  //   if (!ticket?.ticket_id) return

  //   try {
  //     const response = await axios.get(`${BACKEND_API_URL}/support/messages/${ticket.ticket_id}`)
  //     const data = response.data

  //     let fetchedMessages = []
  //     if (Array.isArray(data)) {
  //       fetchedMessages = data
  //     } else if (Array.isArray(data.data)) {
  //       fetchedMessages = data.data
  //     } else if (Array.isArray(data.messages)) {
  //       fetchedMessages = data.messages
  //     }

  //     fetchedMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  //     if (fetchedMessages.length > messagesRef.current.length) {
  //       setMessages(fetchedMessages)
  //       setTimeout(scrollToBottom, 100)
  //     }
  //   } catch (error) {
  //     console.error('Error refreshing messages:', error)
  //   }
  // }

  const refreshMessages = async () => {
  if (!ticket?.ticket_id) return

  try {
    const response = await axios.get(`${BACKEND_API_URL}/support/messages/${ticket.ticket_id}`)
    const data = response.data

    let fetchedMessages = []
    if (Array.isArray(data)) {
      fetchedMessages = data
    } else if (Array.isArray(data.data)) {
      fetchedMessages = data.data
    } else if (Array.isArray(data.messages)) {
      fetchedMessages = data.messages
    }

    fetchedMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

    // Check if there are new messages (only then auto-scroll)
    const hasNewMessages = fetchedMessages.length > messagesRef.current.length
    
    // Check if any existing message has changed (including is_seen)
    const hasChangedMessages = fetchedMessages.length === messagesRef.current.length &&
      fetchedMessages.some((msg, idx) => {
        const oldMsg = messagesRef.current[idx]
        return JSON.stringify(msg) !== JSON.stringify(oldMsg)
      })

    // Update state if there are new messages or if any message has changed
    if (hasNewMessages || hasChangedMessages) {
      setMessages(fetchedMessages)
      // Only auto-scroll if there are new messages, not if only is_seen changed
      if (hasNewMessages) {
        setTimeout(scrollToBottom, 100)
      }
    }
  } catch (error) {
    console.error('Error refreshing messages:', error)
  }
}


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    } catch (error) {
      return ''
    }
  }

  const handleFileSelect = (event) => {
    const selected = event.target.files?.[0]
    if (!selected) return

    if (!selected.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const clearFileSelection = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return

    const text = newMessage.trim()
    const optimisticId = `temp-${Date.now()}`
    const optimisticMessage = {
      id: optimisticId,
      ticket_id: ticket.ticket_id,
      sender_type: 'admin',
      sender_id: 1,
      message: text,
      message_img: preview || null,
      created_at: new Date().toISOString()
    }

    setMessages((prev) => [...prev, optimisticMessage])
    setNewMessage('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    clearFileSelection()
    scrollToBottom()

    try {
      setSending(true)

      // Get admin info for sending reply
      const adminInfo = getAdminInfo();

      const formData = new FormData()
      formData.append('sender_type', 'admin')
      formData.append('sender_id', 1)
      formData.append('message', text)
      // UPDATED: Send admin info with reply so backend stores who replied
      formData.append('closed_by_admin_id', adminInfo.admin_id || '')
      formData.append('closed_by_admin_name', adminInfo.admin_name || '')
      if (file) {
        formData.append('message_img', file)
      }

      const response = await axios.post(
        `${BACKEND_API_URL}/support/reply/${ticket.ticket_id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      const saved = response.data?.data || response.data || {}
      const updatedMessage = {
        ...optimisticMessage,
        id: saved.id || optimisticId.id,
        message_img: saved.message_img || saved.message_img_url || optimisticMessage.message_img,
        created_at: saved.created_at || optimisticMessage.created_at
      }

      setMessages((prev) =>
        prev.map((msg) => (msg.id === optimisticId ? updatedMessage : msg))
      )

      // UPDATED: Also update closed_by_admin_name in parent tickets list
      if (response.data?.status && typeof setTickets === 'function') {
        setTickets((prev) =>
          prev?.map((item) =>
            item.ticket_id === ticket.ticket_id
              ? { 
                  ...item, 
                  status: response.data.status,
                  closed_by_admin_name: adminInfo.admin_name || item.closed_by_admin_name
                }
              : item
          )
        )
      }

      setTimeout(scrollToBottom, 100)
      toast.success('Message sent')
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId))
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const handleEndChat = async () => {
    setEndingChat(true)
    try {
      const adminInfo = getAdminInfo();

      const response = await axios.put(
        `${BACKEND_API_URL}/support/close/${ticket.ticket_id}`,
        {
          chat_ended: 'yes',
          closed_by_admin_id: adminInfo.admin_id,
          closed_by_admin_name: adminInfo.admin_name
        }
      )

      setChatEnded(true)
      setShowEndChatModal(false)
      toast.success('Chat ended successfully')

      // UPDATED: Update ticket in parent with full admin details
      if (typeof setTickets === 'function') {
        setTickets((prev) =>
          prev?.map((item) =>
            item.ticket_id === ticket.ticket_id
              ? { 
                  ...item, 
                  chat_ended: 'yes', 
                  status: 'closed', 
                  closed_by_admin_name: adminInfo.admin_name,
                  updated_at: new Date().toISOString()
                }
              : item
          )
        )
      }

      // Add system message to chat
      const systemMessage = {
        id: `system-${Date.now()}`,
        ticket_id: ticket.ticket_id,
        sender_type: 'system',
        message: `This conversation was ended by ${adminInfo.admin_name || 'Admin'}.`,
        created_at: new Date().toISOString()
      }
      setMessages((prev) => [...prev, systemMessage])
      scrollToBottom()
    } catch (error) {
      console.error('Error ending chat:', error)
      toast.error('Failed to end chat')
    } finally {
      setEndingChat(false)
    }
  }

  const handleReopenChat = async () => {
    setEndingChat(true)
    try {
      const response = await axios.put(
        `${BACKEND_API_URL}/support/reopen/${ticket.ticket_id}`,
        { chat_ended: 'no' }
      )

      setChatEnded(false)
      toast.success('Chat reopened successfully')

      // Update ticket in parent
      if (typeof setTickets === 'function') {
        setTickets((prev) =>
          prev?.map((item) =>
            item.ticket_id === ticket.ticket_id
              ? { ...item, chat_ended: 'no', status: 'open' }
              : item
          )
        )
      }

      // Add system message to chat
      const systemMessage = {
        id: `system-${Date.now()}`,
        ticket_id: ticket.ticket_id,
        sender_type: 'system',
        message: 'Support team reopened this conversation.',
        created_at: new Date().toISOString()
      }
      setMessages((prev) => [...prev, systemMessage])
      scrollToBottom()
    } catch (error) {
      console.error('Error reopening chat:', error)
      toast.error('Failed to reopen chat')
    } finally {
      setEndingChat(false)
    }
  }

  const getStatusBadgeStyles = () => {
    if (chatEnded) {
      return 'bg-red-500/20 border border-red-500/50 text-red-400'
    }
    return 'bg-green-500/20 border border-green-500/50 text-green-400'
  }

  const getStatusBadgeText = () => {
    return chatEnded ? 'CLOSED' : 'OPEN'
  }

  // FIXED: Get user name from ticket - check all possible field names
  const getTicketUserName = () => {
    return ticket?.username || ticket?.user_name || ticket?.name || ticket?.first_name || 'User'
  }

  // FIXED: Get user ID from ticket - check all possible field names
  const getTicketUserId = () => {
    return ticket?.user_id || ticket?.userId || ticket?.sender_id || ''
  }

  const handleTextareaResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 160);
      textarea.style.height = `${newHeight}px`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-xs">
      <div className="relative w-full h-[90vh] max-w-5xl rounded-3xl bg-slate-900 shadow-2xl text-white overflow-hidden flex flex-col">
        
        {/* HEADER */}
        <div className="flex-shrink-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/20">
                <MessageCircle size={20} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white">Support Ticket</h2>
                <p className="text-sm text-slate-300 mt-1 truncate">{ticket?.subject || 'Support conversation'}</p>
                {/* CHANGED: Show user name and account ID on separate lines */}
                <div className="flex items-center gap-4 mt-0.5">
                  <p className="text-xs text-slate-400">
                    <span className="text-white/50">User Name:</span> <span className="text-cyan-300 font-semibold">{getTicketUserName()}</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    <span className="text-white/50">Account ID:</span> <span className="text-white/70">#{getTicketUserId()}</span>
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full border ${
                ticket?.ticket_source === 'mobile_app'
                  ? "bg-purple-500/20 border-purple-500/50"
                  : "bg-cyan-500/20 border-cyan-500/50"
              }`}>
                <span className={`text-xs font-semibold ${
                  ticket?.ticket_source === 'mobile_app' ? "text-purple-400" : "text-cyan-300"
                }`}>
                  {ticket?.ticket_source === 'mobile_app' ? "📱 Mobile App" : "🌐 Website"}
                </span>
              </div>
              <div className={`px-3 py-1 rounded-full ${getStatusBadgeStyles()}`}>
                <span className="text-xs font-semibold">{getStatusBadgeText()}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/50">
                <span className="text-xs font-semibold text-blue-300">#{ticket?.ticket_id}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            {chatEnded ? (
              <button
                onClick={handleReopenChat}
                disabled={endingChat}
                className="flex-shrink-0 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-3 py-2 transition-all duration-200 flex items-center gap-2 text-sm font-semibold"
                title="Reopen chat for user"
              >
                {endingChat ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <LockOpen size={16} />
                )}
                Reopen
              </button>
            ) : (
              <button
                onClick={() => setShowEndChatModal(true)}
                disabled={endingChat}
                className="flex-shrink-0 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-3 py-2 transition-all duration-200 flex items-center gap-2 text-sm font-semibold"
                title="End this conversation"
              >
                {endingChat ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Lock size={16} />
                )}
                End Chat
              </button>
            )}
            <button
              onClick={onclose}
              className="flex-shrink-0 text-slate-400 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-slate-800"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* UPDATED: Action Details Bar - shows admin action info prominently */}
        {ticket?.closed_by_admin_name && (
          <div className="flex-shrink-0 bg-slate-800/80 border-b border-slate-700 px-6 py-3">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Action Details</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white/50 text-xs">Status:</span>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-500/20 text-green-400 border border-green-500/30">
                  ✅ Closed
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white/50 text-xs">Closed By:</span>
                <span className="text-cyan-300 text-xs font-semibold">{ticket.closed_by_admin_name}</span>
              </div>
              {ticket.updated_at && (
                <div className="flex items-center gap-1.5">
                  <span className="text-white/50 text-xs">Closed At:</span>
                  <span className="text-white/70 text-xs">{new Date(ticket.updated_at).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BODY */}
        <div className="flex-1 overflow-hidden flex flex-col">
          
          {/* Issue Summary Card */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-slate-700">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Issue Description</h4>
              <p className="text-sm leading-6 text-slate-200 line-clamp-3">
                {ticket?.message || 'No description provided'}
              </p>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto scroll-smooth bg-gradient-to-b from-slate-900 to-slate-950">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 mb-3">
                    <Loader size={20} className="text-slate-400 animate-spin" />
                  </div>
                  <p className="text-slate-400">Loading messages...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center px-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                    <MessageCircle size={32} className="text-slate-600" />
                  </div>
                  <p className="text-slate-400 mb-1 font-medium">No conversation yet</p>
                  <p className="text-xs text-slate-500">Send the first reply to start the conversation</p>
                </div>
              </div>
            ) : (
              <div className="px-6 py-6 space-y-4">
                {messages.map((msg, index) => {
                  const isAdmin = msg.sender_type === 'admin'
                  const isSystem = msg.sender_type === 'system'
                  const prevMsg = messages[index - 1]
                  const showTimestamp = !prevMsg || 
                    (new Date(msg.created_at) - new Date(prevMsg.created_at)) > 300000

                  if (isSystem) {
                    return (
                      <div key={msg.id || index} className="flex justify-center my-4">
                        <div className="text-xs text-slate-400 bg-slate-800/50 px-3 py-2 rounded-full">
                          {msg.message}
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={msg.id || index}>
                      {showTimestamp && (
                        <div className="flex justify-center mb-4">
                          <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">
                            {new Date(msg.created_at).toLocaleDateString()} {formatTime(msg.created_at)}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[70%] rounded-2xl px-3 py-2 shadow-lg transition-all duration-200 hover:shadow-xl ${
                            isAdmin
                              ? 'bg-gradient-to-r from-blue-900 to-cyan-900 text-white rounded-br-none'
                              : 'bg-slate-700 text-slate-100 rounded-bl-none'
                          }`}
                        >
                          {/* UPDATED: Show admin name on admin messages */}
                          {isAdmin && (
                            <span className="block text-[10px] font-semibold text-cyan-200/70 mb-1">
                              {ticket?.closed_by_admin_name || 'Admin'}
                            </span>
                          )}

                          {msg.message && (
                            <p className="text-sm p-1 leading-6 break-words whitespace-pre-wrap">
                              {msg.message}
                            </p>
                          )}

                          {msg.message_img && (
                            <button
                              type="button"
                              onClick={() => setLightboxImage(getMessageImageSrc(msg.message_img))}
                              className="mt-3 block overflow-hidden rounded-2xl group"
                            >
                              <img
                                src={getMessageImageSrc(msg.message_img)}
                                alt="attachment"
                                className="max-w-[300px] max-h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </button>
                          )}

                          <span className="flex gap-1.5 mt-1 text-[9px] opacity-80 italic text-slate-300 items-center justify-end">
                            {formatTime(msg.created_at)}
                           {isAdmin && (
                                  <CheckCheck
                                    size={15}
                                    className={msg.is_seen ? "text-sky-400" : "text-gray-400"}
                                />
                          )}
                          </span>

                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex-shrink-0 border-t border-slate-700 bg-slate-950 space-y-4 p-4">
          
          {/* Image Preview */}
          {preview && (
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-2xl border border-slate-700">
              <img
                src={preview}
                alt="preview"
                className="h-16 w-16 rounded-xl object-cover flex-shrink-0 border border-slate-600"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-100 truncate font-medium">{file?.name}</p>
                <p className="text-xs text-slate-400">Ready to send</p>
              </div>
              <button
                type="button"
                onClick={clearFileSelection}
                className="flex-shrink-0 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-full transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* Chat Ended Alert */}
          {chatEnded && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 text-center">
              <p className="text-sm font-semibold text-red-400">Chat Ended</p>
              <p className="text-xs text-red-300 mt-1">This conversation has been closed. User cannot send new messages.</p>
            </div>
          )}

          {/* Message Input Area */}
          {!chatEnded ? (
            <div className="flex items-end gap-3 bg-slate-800/50 rounded-full border border-slate-700 p-1 pl-4">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 p-2.5 rounded-full hover:bg-slate-700 transition-all duration-200 text-slate-400 hover:text-slate-200 hover:scale-105"
                title="Attach image"
              >
                <Paperclip size={22} />
              </button>

              <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTextareaResize();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={1}
              placeholder="Type your reply..."
              className="flex-1 min-h-[44px] max-h-[160px] resize-none bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none overflow-y-auto"
              />

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={sending || (!newMessage.trim() && !file)}
                className="flex-shrink-0 p-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {sending ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <SendHorizontal size={20} />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center py-4 px-4 bg-slate-800/50 rounded-full border border-slate-700">
              <p className="text-slate-400 font-semibold flex items-center gap-2">
                <Lock size={18} />
                Conversation Ended
              </p>
            </div>
          )}
        </div>

        {/* End Chat Confirmation Modal */}
        {showEndChatModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-3xl">
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm mx-4 border border-slate-700">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4 mx-auto">
                <Lock size={24} className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">End Chat?</h3>
              <p className="text-slate-300 text-center text-sm mb-6">
                Are you sure you want to end this conversation? The user will no longer be able to reply.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEndChatModal(false)}
                  disabled={endingChat}
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEndChat}
                  disabled={endingChat}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {endingChat ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Ending...
                    </>
                  ) : (
                    'End Chat'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 text-white hover:text-slate-300 transition-colors z-10 p-2 rounded-full hover:bg-black/50"
            >
              <X size={28} />
            </button>
            <img
              src={lightboxImage}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] rounded-3xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Reply
