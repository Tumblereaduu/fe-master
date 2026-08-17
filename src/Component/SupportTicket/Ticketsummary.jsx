import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { Paperclip, SendHorizontal, X, MessageCircle, ChevronLeft, Lock } from 'lucide-react'
import { BACKEND_API_URL } from '../../api/config';
import NavbarForAccount from '../NavbarForAccount';
import DoinDashboardSidebar from '../DoinDashboardSidebar';


const Ticketsummary = () => {

    const navigate = useNavigate()
    const { state } = useLocation();
    const ticketId = state?.ticketId
    const messagesEndRef = useRef(null)
    const fileInputRef = useRef(null)
    const intervalRef = useRef(null)
    const messagesRef = useRef([])
    const lastMessageCountRef = useRef(0)

    const [ticket, setTicket] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [messagesLoading, setMessagesLoading] = useState(true)
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [chatEnded, setChatEnded] = useState(false)
    const messageIdsRef = useRef(new Set())

    // Fetch ticket details
    useEffect(() => {
        if (ticketId) {
            fetch(`${BACKEND_API_URL}/support/${ticketId}`)
                .then(res => res.json())
                .then(data => {
                    setTicket(data)
                    setChatEnded(data?.chat_ended === 'yes')
                })
                .catch(err => console.log('Error fetching ticket:', err))
        }
    }, [ticketId])

    // Fetch all messages - Initial load
    const fetchMessages = async () => {
        if (!ticketId) return
        
        try {
            setMessagesLoading(true)
            console.log('Fetching messages for ticket:', ticketId)
            console.log('API URL:', `${BACKEND_API_URL}/support/messages/${ticketId}`)
            
            const response = await fetch(`${BACKEND_API_URL}/support/messages/${ticketId}`)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            console.log('Messages fetched:', data)
            
            // Handle different response formats
            let fetchedMessages = []
            if (Array.isArray(data)) {
                fetchedMessages = data
            } else if (data.data && Array.isArray(data.data)) {
                fetchedMessages = data.data
            } else if (data.status === 'success' && Array.isArray(data.data)) {
                fetchedMessages = data.data
            } else if (data.message) {
                fetchedMessages = [data]
            } else {
                console.warn('Unexpected data format:', data)
                fetchedMessages = []
            }
            
            // Sort by created_at ascending (oldest first)
            fetchedMessages.sort((a, b) => {
                const dateA = new Date(a.created_at)
                const dateB = new Date(b.created_at)
                return dateA - dateB
            })
            
            setMessages(fetchedMessages)
            messagesRef.current = fetchedMessages
            lastMessageCountRef.current = fetchedMessages.length
            messageIdsRef.current = new Set(fetchedMessages.map(msg => msg.id || msg.created_at))
            
            // Auto-scroll after initial load
            setTimeout(() => {
                scrollToBottom()
            }, 100)
        } catch (err) {
            console.error('Error fetching messages:', err)
            setMessages([])
        } finally {
            setMessagesLoading(false)
        }
    }

    // Refresh messages - Smart polling without full reload
    const refreshMessages = async () => {
        if (!ticketId) return
        
        try {
            // Fetch messages
            const messageResponse = await fetch(`${BACKEND_API_URL}/support/messages/${ticketId}`)
            
            if (!messageResponse.ok) {
                throw new Error(`HTTP error! status: ${messageResponse.status}`)
            }
            
            const messageData = await messageResponse.json()
            console.log('Refreshed messages:', messageData)
            
            // Handle different response formats
            let fetchedMessages = []
            if (Array.isArray(messageData)) {
                fetchedMessages = messageData
            } else if (messageData.data && Array.isArray(messageData.data)) {
                fetchedMessages = messageData.data
            } else if (messageData.status === 'success' && Array.isArray(messageData.data)) {
                fetchedMessages = messageData.data
            } else if (messageData.message && typeof messageData.message === 'string') {
                fetchedMessages = [messageData]
            } else {
                fetchedMessages = []
            }
            
            // Sort by created_at ascending (oldest first)
            fetchedMessages.sort((a, b) => {
                const dateA = new Date(a.created_at)
                const dateB = new Date(b.created_at)
                return dateA - dateB
            })
            
            // Fetch ticket to check chat ended status
            try {
                const ticketResponse = await fetch(`${BACKEND_API_URL}/support/${ticketId}`)
                if (ticketResponse.ok) {
                    const ticketData = await ticketResponse.json()
                    const newChatEndedStatus = ticketData?.chat_ended === 'yes'
                    
                    // Update chat ended status if changed
                    if (newChatEndedStatus !== chatEnded) {
                        console.log('Chat ended status changed to:', newChatEndedStatus)
                        setChatEnded(newChatEndedStatus)
                    }
                }
            } catch (ticketErr) {
                console.error('Error fetching ticket status:', ticketErr)
            }
            
            // Smart update: Only update state if message count changed
            const currentMessageCount = messagesRef.current.length
            const newMessageCount = fetchedMessages.length
            
            if (newMessageCount !== currentMessageCount) {
                console.log(`New messages detected: ${newMessageCount - currentMessageCount} new message(s)`)
                
                // Update messages state
                setMessages(fetchedMessages)
                messagesRef.current = fetchedMessages
                lastMessageCountRef.current = newMessageCount
                messageIdsRef.current = new Set(fetchedMessages.map(msg => msg.id || msg.created_at))
                
                // Auto-scroll to bottom when new messages arrive
                setTimeout(() => {
                    scrollToBottom()
                }, 50)
            }
        } catch (err) {
            console.error('Error refreshing messages:', err)
        }
    }

    // Scroll to bottom function
    const scrollToBottom = () => {
        try {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        } catch (error) {
            console.error('Scroll error:', error)
        }
    }

    // Setup auto-refresh on mount
    useEffect(() => {
        if (!ticketId) return
        
        // Initial fetch
        fetchMessages()
        
        // Auto-refresh every 2.5 seconds (smart polling - only updates if new messages)
        intervalRef.current = setInterval(() => {
            refreshMessages()
        }, 2500)

        // Cleanup interval on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                console.log('Cleared refresh interval')
            }
        }
    }, [ticketId])

    // Auto scroll only when message count changes (new messages)
    useEffect(() => {
        if (messages.length > lastMessageCountRef.current) {
            console.log('New message detected, scrolling to bottom')
            lastMessageCountRef.current = messages.length
            setTimeout(() => {
                scrollToBottom()
            }, 100)
        }
    }, [messages.length])

    // Cleanup object URLs when component unmounts or file changes
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    // Format timestamp
    const formatTime = (timestamp) => {
        if (!timestamp) return ''
        try {
            const date = new Date(timestamp)
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        } catch (error) {
            return ''
        }
    }

    // Handle file selection
    const handleFileSelect = (e) => {
        if (chatEnded) return
        
        const selected = e.target.files?.[0]
        if (selected && selected.type.startsWith('image/')) {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview)
            }
            setFile(selected)
            const previewUrl = URL.createObjectURL(selected)
            setPreview(previewUrl)
        } else {
            alert('Please select a valid image file')
        }
    }

    // Clear selected file
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

    // Handle send message
    const handleSendMessage = async () => {
        if (chatEnded || (!newMessage.trim() && !file)) return

        // Optimistically add message to UI
        const optimisticMsg = {
            id: `temp-${Date.now()}`,
            ticket_id: ticketId,
            sender_type: 'user',
            sender_id: 10,
            message: newMessage,
            message_img: preview || null,
            created_at: new Date().toISOString()
        }
        
        const messageText = newMessage
        
        // Optimistically update UI
        setMessages(prevMessages => [...prevMessages, optimisticMsg])
        messagesRef.current = [...messagesRef.current, optimisticMsg]
        setNewMessage("")
        
        // Scroll to the new message
        setTimeout(() => {
            scrollToBottom()
        }, 50)

        try {
            setLoading(true)
            console.log('Sending message to:', `${BACKEND_API_URL}/support/reply/${ticketId}`)
            
            // Create FormData for file upload
            const formData = new FormData()
            formData.append('sender_type', 'user')
            formData.append('sender_id', 10)
            formData.append('message', messageText)
            if (file) {
                formData.append('message_img', file)
            }
            
            const response = await axios.post(
                `${BACKEND_API_URL}/support/reply/${ticketId}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            )

            console.log('Send message response:', response.data)
            const data = response.data
            
            // Update optimistic message with real data from server
            if (data.id || data.data?.id) {
                const realId = data.id || data.data?.id
                const updatedMessage = {
                    ...optimisticMsg,
                    id: realId,
                    message_img: data.message_img || data.data?.message_img || optimisticMsg.message_img,
                    created_at: data.created_at || data.data?.created_at || optimisticMsg.created_at
                }
                
                setMessages(prevMessages => 
                    prevMessages.map(msg => 
                        msg.id === optimisticMsg.id ? updatedMessage : msg
                    )
                )
                
                messagesRef.current = messagesRef.current.map(msg => 
                    msg.id === optimisticMsg.id ? updatedMessage : msg
                )
            }
            
            // Clear file selection after successful send
            clearFileSelection()
            
            // Trigger refresh to get latest messages from server
            setTimeout(() => {
                refreshMessages()
            }, 300)
        } catch (err) {
            console.error('Error sending message:', err)
            // Remove the optimistic message on error
            setMessages(prevMessages => 
                prevMessages.filter(msg => msg.id !== optimisticMsg.id)
            )
            messagesRef.current = messagesRef.current.filter(msg => msg.id !== optimisticMsg.id)
            setNewMessage(messageText)
            alert('Failed to send message. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (chatEnded) return
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

//     useEffect(() => {
//     axios.put(
//         `${BACKEND_API_URL}/support/messages/seen/${ticket.ticket_id}`
//     );
// }, [ticket.ticket_id]);


    return (
        <div className='bg-gray-50 min-h-screen'>
            <NavbarForAccount />
            <div className="flex">

                <div className="md:w-64 lg:w-72 hidden md:block">
                    <DoinDashboardSidebar />
                </div>

                <div className='flex-1 w-full md:ml-0 mt-12 px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 overflow-x-hidden'>
                    {/* Ticket Summary Heading */}
                    <div className='flex justify-between items-end mb-4 md:mb-6'>
                        <h2 className='font-bold text-2xl md:text-3xl lg:text-4xl text-gray-900'>Ticket Summary</h2>
                        <p className='text-gray-600 text-xs sm:text-sm mt-2'>Ticket ID: <span className='font-semibold'>{ticketId}</span></p>
                    </div>

                    {/* Issue Description Section */}
                    <div className='mb-6'>
                        <h3 className='text-lg lg:text-xl font-semibold text-gray-700 mb-3'>Issue Description</h3>
                        {
                            ticket ? (
                                <div className='bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-3 w-full'>
                                {/* Issue Description */}
                                    <p className='text-gray-800 text-sm sm:text-base md:text-xl leading-relaxed break-words whitespace-pre-wrap'>{ticket.subject || 'General Issue'}</p>
                                </div>
                            ) :
                                <div className='bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 w-full'>
                                    <p className='text-gray-500 animate-pulse text-sm sm:text-base'>Loading ticket details...</p>
                                </div>
                        }
                    </div>

                    {/* Support Team Chat Section - WhatsApp Style */}
                    <div className='mb-5'>
                        <div className='flex items-center justify-between mb-2'>
                            <h3 className='text-lg lg:text-xl font-semibold text-gray-700'>Support Conversation </h3>
                            {/* {chatEnded && (
                                <div className='px-3 py-1 rounded-full bg-gray-500/20 border border-gray-500/50 flex items-center gap-2'>
                                    <Lock size={14} className='text-red-400' />
                                    <span className='text-sm font-medium text-red-400'>Conversation Closed</span>
                                </div>
                            )} */}
                        </div>
                        
                        {/* WhatsApp-style Chat Container */}
                        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full flex flex-col' style={{ height: 'clamp(400px, 58vh, 700px)' }}>
                            
                            {/* Chat Header */}
                            <div className='bg-blue-500 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-10'>
                                <div className='flex items-center gap-3'>
                                    <MessageCircle size={26} className='flex-shrink-0' />
                                    <div>
                                        <h4 className='font-semibold text-base sm:text-lg'>Support Team</h4>
                                        <p className='text-xs opacity-90'>{chatEnded ? 'Conversation ended' : 'Always here to help'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className='flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4 bg-gray-50 scroll-smooth'>
                                {messagesLoading ? (
                                    <div className='flex flex-col items-center justify-center h-full space-y-4'>
                                        <div className='text-gray-400 animate-pulse'>
                                            <MessageCircle size={48} />
                                        </div>
                                        <p className='text-gray-500 text-center font-medium text-sm sm:text-base'>Loading messages...</p>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className='flex flex-col items-center justify-center h-full space-y-4'>
                                        <div className='text-gray-300'>
                                            <MessageCircle size={48} />
                                        </div>
                                        <p className='text-gray-500 text-center font-medium text-sm sm:text-base'>No messages yet</p>
                                        <p className='text-gray-400 text-center text-xs sm:text-sm'>Start the conversation by sending a message below!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isUser = msg.sender_type === 'user'
                                        const isSystem = msg.sender_type === 'system'
                                        

                                        if (isSystem) {
                                            return (
                                                <div key={msg.id || index} className='flex justify-center my-4'>
                                                    <div className='text-xs text-gray-500 bg-gray-200 px-3 py-2 rounded-full'>
                                                        {msg.message}
                                                    </div>
                                                </div>
                                            )
                                        }
                                        
                                        return (
                                            <div
                                                key={msg.id || index}
                                                className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                                            >
                                                <div
                                                    className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-2xl group transition-all ${
                                                        isUser
                                                            ? 'bg-gradient-to-r from-[#2e61ec] to-[#3c87f7] text-white rounded-br-none shadow-md hover:shadow-lg'
                                                            : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200 hover:shadow-md'
                                                    }`}
                                                >
                                                    {/* CHANGED: Show user name only on user's own messages - NOT on admin messages */}
                                                    {isUser && (
                                                        <span className="block text-[10px] font-semibold text-blue-100/80 mb-1">You</span>
                                                    )}
                                                    <p className='text-xs sm:text-sm break-words leading-relaxed'>{msg.message}</p>
                                                    
                                                    {/* Image attachment */}
                                                    {msg.message_img && (
                                                        <div className='mt-3 rounded-lg overflow-hidden'>
                                                            <img
                                                                src={msg.message_img && (msg.message_img.startsWith('http') || msg.message_img.startsWith('blob:')) ? msg.message_img : `${BACKEND_API_URL}/${msg.message_img}`}
                                                                alt="Message attachment"
                                                                className='max-w-xs rounded-lg max-h-40 object-cover hover:opacity-90 transition-opacity cursor-pointer'
                                                            />
                                                        </div>
                                                    )}
                                                    
                                                    {/* <span className={`text-xs block mt-2 opacity-75 ${isUser ? 'text-orange-100' : 'text-gray-500'}`}>
                                                        {formatTime(msg.created_at)}
                                                    </span> */}
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Chat Ended Alert - Shown before file preview and input */}
                            {/* {chatEnded && (
                                <div className='mx-4 sm:mx-6 my-4 bg-gray-500/10 border border-gray-500/50 rounded-2xl p-4 text-center'>
                                    <div className='flex items-center justify-center gap-2 mb-2'>
                                        <Lock size={18} className='text-red-400' />
                                        <p className='text-sm font-semibold text-red-600'>Conversation Ended</p>
                                    </div>
                                    <p className='text-xs text-red-500'>This conversation has been ended by the support team. Please create a new ticket for further assistance.</p>
                                </div>
                            )} */}

                            {/* File Preview - Hidden if chat ended */}
                            {preview && !chatEnded && (
                                <div className='px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-end gap-3'>
                                    <div className='relative'>
                                        <img 
                                            src={preview} 
                                            alt="Preview" 
                                            className='h-16 w-16 object-cover rounded-lg border border-gray-300'
                                        />
                                        <button
                                            onClick={clearFileSelection}
                                            className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all hover:scale-105 duration-200'
                                            title='Remove image'
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <p className='text-xs text-gray-600 flex-1 truncate'>{file?.name}</p>
                                </div>
                            )}

                            {/* Chat Input Footer - Show active input or locked state */}
                            {!chatEnded ? (
                                <div className='border-t border-gray-200 bg-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-end gap-2 sm:gap-3 sticky bottom-0 shadow-lg rounded-b-2xl'>
                                    <input
                                        type='file'
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept='image/*'
                                        className='hidden'
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className='flex-shrink-0 p-2 sm:p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all hover:scale-105 duration-200'
                                        title='Attach image'
                                    >
                                        <Paperclip size={20} />
                                    </button>
                                    <input
                                        type='text'
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder='Type a message...'
                                        className='flex-1 border border-gray-300 rounded-full px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-[#1264df] focus:border-transparent text-xs sm:text-sm bg-gray-50 transition-all'
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={loading || (!newMessage.trim() && !file)}
                                        className='bg-gradient-to-r from-[#1f64fa] to-[#1d71f0] text-white p-2 sm:p-3 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 hover:scale-105 duration-200 flex-shrink-0 flex items-center justify-center'
                                        title={loading ? 'Sending...' : 'Send message'}
                                    >
                                        {loading ? (
                                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                        ) : (
                                            <SendHorizontal size={20} />
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className='border-t border-gray-200 bg-white px-3 sm:px-4 md:px-6 py-4 sm:py-6 flex items-center justify-center sticky bottom-0 shadow-lg rounded-b-2xl'>
                                    <div className='flex items-center justify-center gap-2 text-gray-500 font-semibold text-sm'>
                                        <Lock size={18} />
                                        <span>Conversation Ended</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-6'>
                        <button
                            className='bg-gradient-to-r from-[#1a7af7] to-[#195cee] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:shadow-lg transition-all font-medium text-xs sm:text-sm active:scale-95 flex items-center gap-2'
                            onClick={() => navigate('/help')}
                        >
                            <ChevronLeft size={18} />
                            Go Back
                        </button>
                        <p className='text-gray-500 text-xs sm:text-sm'>Questions? Contact support anytime</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Ticketsummary
