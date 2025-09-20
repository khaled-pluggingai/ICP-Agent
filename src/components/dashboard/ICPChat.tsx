import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Sparkles, Zap, Building, Globe, ExternalLink, Loader2, RefreshCw, AlertCircle, CheckCircle } from "lucide-react"
import CompanyResult from './CompanyResult'

interface Message {
  id: string
  content: string | React.ReactNode
  role: "user" | "assistant"
  timestamp: Date
}

interface SearchResult {
  full_name: string
  country_name: string
  company_name: string
  company_linkedin: string
  company_website: string
  created_at?: string // ISO timestamp when company was added
}


export function ICPChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: (
        <div className="space-y-4">
          <p>Hello! I'm your ICP Research Agent. I can help you identify and analyze your ideal customer profiles.</p>
          <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-lg">
            <p className="text-sm font-semibold text-green-400 mb-2">📝 Example Request:</p>
            <p className="text-sm italic text-foreground/80 mb-3">"I want to find Canadian software development companies for AI marketing with revenue 10k+ and size of 15+ employees"</p>
            <p className="text-xs text-green-400/70">💡 Required fields: Country, Industry/Field, Revenue, Company Size</p>
          </div>
          <p>Please provide your search criteria including all required fields above.</p>
        </div>
      ),
      role: "assistant",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [lastError, setLastError] = useState<string>("")
  
  const abortControllerRef = useRef<EventSource | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        console.log('🧹 Cleaning up EventSource on unmount');
        abortControllerRef.current.close();
      }
    };
  }, []);


  /**
   * Sends the user's query to the backend to start the enrichment workflow.
   * Includes a retry mechanism for improved reliability.
   * @param {string} userQuery The query entered by the user.
   * @returns {Promise<boolean>} A promise that resolves to true if the workflow started successfully, false otherwise.
   */
  const startWorkflow = async (userQuery: string): Promise<boolean> => {
    const apiUrl = 'https://web-production-d9ac8.up.railway.app/start-workflow';
    
    // Retry logic configuration
    const retries = 3;
    let backoff = 1000; // Start with a 1-second delay

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: userQuery }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Backend confirmation:', data.message);
          return true; // Success!
        }

        // If it's a server error (5xx), it's worth retrying.
        if (response.status >= 500) {
          throw new Error(`Server error: ${response.status}`);
        }

        // For other errors (e.g., 4xx), don't retry as it won't help.
        console.error(`Client-side error: ${response.status}. Aborting.`);
        return false;

      } catch (error: any) {
        console.warn(`Attempt ${i + 1} failed: ${error.message}`);
        if (i === retries - 1) {
          console.error('Failed to start workflow after all retries.');
          return false; // All retries failed
        }
        // Wait before the next retry
        await new Promise(res => setTimeout(res, backoff));
        backoff *= 2; // Double the delay for the next attempt
      }
    }
    return false;
  };

  /**
   * Connects to the SSE endpoint to receive and display live progress updates.
   */
  const listenForLiveUpdates = () => {
    const statusUrl = 'https://web-production-d9ac8.up.railway.app/workflow-status';
    console.log('🔗 Creating EventSource connection to:', statusUrl);
    
    const eventSource = new EventSource(statusUrl);
    console.log('✅ EventSource created:', eventSource);
    console.log('🔍 EventSource readyState:', eventSource.readyState);
    console.log('🔍 EventSource url:', eventSource.url);

    // Add connection state logging
    eventSource.onopen = (event) => {
      console.log('🚀 SSE connection opened successfully', event);
      console.log('🔍 EventSource readyState after open:', eventSource.readyState);
    };

    // This is called for every message received from the server.
    eventSource.onmessage = (event) => {
      console.log('📨 Raw SSE data received:', event.data);
      
      try {
        // The data is a JSON string, so we must parse it.
        const update = JSON.parse(event.data);
        console.log('✅ Parsed update:', update);
        
        // Update the chatbot's state with this new message
        const updateMessage: Message = {
          id: Date.now().toString(),
          content: (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {update.status === 'complete' && <CheckCircle className="w-4 h-4 text-green-400" />}
                {update.status === 'processing' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                {update.status === 'searching' && <Globe className="w-4 h-4 text-yellow-400" />}
                {update.status === 'found' && <Sparkles className="w-4 h-4 text-green-400" />}
                <span className="text-sm font-medium">{update.message}</span>
              </div>
              {update.progress && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${update.progress}%` }}
                  />
                </div>
              )}
            </div>
          ),
          role: "assistant",
          timestamp: new Date()
        };

        console.log('📝 Adding message to state:', updateMessage);
        setMessages(prev => {
          const newMessages = [...prev, updateMessage];
          console.log('📊 Updated messages array length:', newMessages.length);
          return newMessages;
        });

        // Check for the completion message to close the connection.
        if (update.status === 'complete') {
          console.log('🏁 Workflow complete, closing SSE connection');
          eventSource.close();
          setIsLoading(false); // Stop loading when complete
        }
      } catch (error) {
        console.error("❌ Error parsing SSE data:", error, "Raw data:", event.data);
        // Display the raw text if parsing fails
        const rawMessage: Message = {
          id: Date.now().toString(),
          content: `Raw update: ${event.data}`,
          role: "assistant",
          timestamp: new Date()
        };
        console.log('📝 Adding raw message to state:', rawMessage);
        setMessages(prev => [...prev, rawMessage]);
      }
    };

    // This is called if the connection fails.
    eventSource.onerror = (error) => {
      console.error('❌ SSE connection failed:', error);
      console.log('🔍 EventSource readyState:', eventSource.readyState);
      console.log('🔍 EventSource readyState constants:', {
        CONNECTING: 0,
        OPEN: 1,
        CLOSED: 2
      });
      
      // Try to reconnect after a delay
      setTimeout(() => {
        console.log('🔄 Attempting to reconnect SSE...');
        eventSource.close();
        const newEventSource = new EventSource(statusUrl);
        newEventSource.onmessage = eventSource.onmessage;
        newEventSource.onopen = eventSource.onopen;
        newEventSource.onerror = eventSource.onerror;
        abortControllerRef.current = newEventSource as any;
      }, 3000);
      
      setIsLoading(false); // Stop loading on error
      
      // Display a persistent error message to the user in the chatbot UI
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span>Connection to server lost. Attempting to reconnect...</span>
          </div>
        ),
        role: "assistant",
        timestamp: new Date()
      };
      console.log('📝 Adding error message to state:', errorMessage);
      setMessages(prev => [...prev, errorMessage]);
    };

    // Return the eventSource object so we can manually close it if needed
    return eventSource;
  };

  const renderSearchResults = (results: SearchResult[]) => {
    // Add timestamps for companies that don't have them (assume they are newly found)
    const resultsWithTimestamps = results.map(result => ({
      ...result,
      created_at: result.created_at || new Date().toISOString()
    }));

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-green-400">
          <Sparkles className="w-4 h-4" />
          <span className="font-semibold">Search Results ({results.length} found)</span>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {resultsWithTimestamps.map((result, index) => (
            <CompanyResult key={index} data={result} index={index} />
          ))}
        </div>
      </div>
    )
  }


  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)
    setLastError("")
    setRetryCount(0)

    // Add initial confirmation message
    const confirmationMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: (
        <div className="flex items-center gap-2 text-green-400">
          <Sparkles className="w-4 h-4" />
          <span>Got it! Starting my search...</span>
        </div>
      ),
      role: "assistant",
      timestamp: new Date()
    }
    setMessages(prev => [...prev, confirmationMessage])

    try {
      // Step 1: Start the workflow
      console.log('🚀 Starting workflow for query:', currentInput);
      const workflowStarted = await startWorkflow(currentInput)
      
      if (!workflowStarted) {
        throw new Error('Failed to start workflow after all retries')
      }

      console.log('✅ Workflow started successfully, now listening for updates...');
      
      // Step 2: Start listening for live updates (ALWAYS call this)
      const eventSource = listenForLiveUpdates()
      
      // Store the event source for cleanup
      abortControllerRef.current = eventSource as any

    } catch (error: any) {
      let errorContent: React.ReactNode
      
      if (error.message.includes('Failed to start workflow')) {
          errorContent = (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
              <span className="font-semibold">Workflow Start Failed</span>
              </div>
              <p className="text-sm text-foreground/80">
              Unable to start the workflow. The service may be temporarily unavailable.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setRetryCount(prev => prev + 1)
                    handleSend()
                  }}
                  size="sm"
                  className="bg-green-500 hover:bg-green-400 text-white"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry Request
                </Button>
              </div>
            </div>
          )
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorContent = (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="font-semibold">Connection Error</span>
            </div>
            <p className="text-sm text-foreground/80">
              Unable to connect to the service. Please check your internet connection and try again.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setRetryCount(prev => prev + 1)
                  handleSend()
                }}
                size="sm"
                className="bg-green-500 hover:bg-green-400 text-white"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry Connection
              </Button>
            </div>
          </div>
        )
      } else {
        errorContent = (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="font-semibold">Processing Error</span>
            </div>
            <p className="text-sm text-foreground/80">
              {error.message || "An unexpected error occurred while processing your request."}
            </p>
            <p className="text-xs text-foreground/60">
              Please ensure your query includes: country, industry, revenue, and company size.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setRetryCount(prev => prev + 1)
                  handleSend()
                }}
                size="sm"
                className="bg-green-500 hover:bg-green-400 text-white"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Try Again
              </Button>
            </div>
          </div>
        )
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        role: "assistant",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setIsLoading(false) // Stop loading on error
    } finally {
      // Don't set isLoading to false here - let the SSE handlers manage it
      // setIsLoading(false) // This was causing the loading to stop immediately
      
      // Note: Cleanup is handled in the error handlers and completion handlers
      // The EventSource will be closed when the workflow completes or errors occur
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Floating holographic chat window */}
      <div className="relative">
        {/* Ambient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-transparent to-emerald-500/20 blur-3xl animate-pulse" />
        
        {/* Main chat container */}
        <Card className="relative h-[700px] flex flex-col overflow-hidden border-0 shadow-2xl"
              style={{
                background: `linear-gradient(135deg, 
                  hsl(220 27% 6% / 0.95) 0%, 
                  hsl(220 27% 8% / 0.9) 50%, 
                  hsl(220 27% 6% / 0.95) 100%)`,
                backdropFilter: 'blur(20px)',
                boxShadow: `
                  0 0 40px hsl(120 100% 50% / 0.3),
                  0 0 80px hsl(140 100% 50% / 0.2),
                  inset 0 1px 0 hsl(210 40% 98% / 0.1)
                `
              }}>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-lg">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/50 via-emerald-500/50 to-green-500/50 opacity-30 animate-pulse" 
                 style={{ padding: '1px' }}>
              <div className="w-full h-full rounded-lg" 
                   style={{
                     background: `linear-gradient(135deg, 
                       hsl(220 27% 6% / 0.95) 0%, 
                       hsl(220 27% 8% / 0.9) 50%, 
                       hsl(220 27% 6% / 0.95) 100%)`
                   }} />
            </div>
          </div>

          {/* Header with AI avatar */}
          <div className="relative p-6 border-b border-green-500/20">
            <div className="flex items-center gap-4">
              <motion.div 
                animate={{ 
                  boxShadow: [
                    "0 0 20px hsl(120 100% 50% / 0.5)",
                    "0 0 30px hsl(140 100% 50% / 0.5)",
                    "0 0 20px hsl(120 100% 50% / 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 p-0.5"
              >
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <Bot className="w-6 h-6 text-green-400" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-400 border-r-emerald-400"
                />
              </motion.div>
              
              <div className="flex-1">
                <motion.h3 
                  className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ICP Research Agent
                </motion.h3>
                <p className="text-sm text-green-400/70 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  AI-powered customer intelligence
                </p>
              </div>
              
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400"
              >
                ● ONLINE
              </motion.div>
            </div>
          </div>

          {/* Messages area with holographic effects */}
          <ScrollArea className="flex-1 p-6 relative">
            <div className="space-y-6">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-4 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      {/* Avatar with glow effect */}
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center relative ${
                          message.role === "user" 
                            ? "bg-gradient-to-br from-emerald-500 to-green-600" 
                            : "bg-gradient-to-br from-green-500 to-emerald-600"
                        }`}
                        style={{
                          boxShadow: message.role === "user" 
                            ? "0 0 20px hsl(140 100% 50% / 0.5)" 
                            : "0 0 20px hsl(120 100% 50% / 0.5)"
                        }}
                      >
                        {message.role === "user" ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <Bot className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                        {message.role === "assistant" && (
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-green-400/30 blur-sm"
                          />
                        )}
                      </motion.div>
                      
                       {/* Message bubble with glassmorphic effect */}
                       <motion.div 
                         whileHover={{ scale: 1.02 }}
                         className={`relative p-4 rounded-2xl backdrop-blur-md ${
                           message.role === "user"
                             ? "bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-400/30"
                             : "bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/30"
                         }`}
                         style={{
                           backdropFilter: "blur(10px)",
                           boxShadow: message.role === "user" 
                             ? "0 8px 32px hsl(140 100% 50% / 0.2), inset 0 1px 0 hsl(140 100% 50% / 0.2)" 
                             : "0 8px 32px hsl(120 100% 50% / 0.2), inset 0 1px 0 hsl(120 100% 50% / 0.2)"
                         }}
                       >
                         <div className="text-sm leading-relaxed text-foreground">
                           {typeof message.content === 'string' ? message.content : message.content}
                         </div>
                        <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                          <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          {message.role === "assistant" && (
                            <motion.div
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="flex items-center gap-1"
                            >
                              <Zap className="w-3 h-3 text-green-400" />
                              <span className="text-green-400">AI</span>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Enhanced typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-4 justify-start"
                >
                  <motion.div 
                     animate={{ 
                       boxShadow: [
                         "0 0 20px hsl(120 100% 50% / 0.3)",
                         "0 0 30px hsl(120 100% 50% / 0.6)",
                         "0 0 20px hsl(120 100% 50% / 0.3)"
                       ]
                     }}
                     transition={{ duration: 1.5, repeat: Infinity }}
                     className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Bot className="w-5 h-5 text-white" />
                    </motion.div>
                  </motion.div>
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/30 p-4 rounded-2xl backdrop-blur-md">
                    <div className="flex gap-2 items-center">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="w-2 h-2 bg-green-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-green-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-green-400 rounded-full"
                      />
                      <span className="text-xs text-green-400 ml-2">
                        AI is connecting to live updates...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Futuristic input area */}
          <div className="relative p-6 border-t border-green-500/20">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your search criteria (country, industry, revenue, size)..."
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/30 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground backdrop-blur-md focus:border-green-400/60 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                  style={{
                    backdropFilter: "blur(10px)",
                    boxShadow: "inset 0 1px 0 hsl(120 100% 50% / 0.1)"
                  }}
                />
                {input && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <Sparkles className="w-4 h-4 text-green-400 animate-pulse" />
                  </motion.div>
                )}
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleSend} 
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 border-0 rounded-xl shadow-lg transition-all duration-300"
                  style={{
                    boxShadow: input.trim() && !isLoading 
                      ? "0 0 20px hsl(120 100% 50% / 0.5), 0 0 40px hsl(140 100% 50% / 0.3)" 
                      : "none"
                  }}
                >
                  <motion.div
                    animate={isLoading ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
                  >
                    <Send className="w-5 h-5 text-white" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
            
            {/* Micro-interaction indicators */}
            <motion.div 
              animate={{ opacity: input.length > 0 ? 1 : 0 }}
              className="absolute bottom-2 left-6 text-xs text-green-400/70 flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              Press Enter to send
            </motion.div>
            
            {/* Status indicators */}
            {(retryCount > 0 || lastError) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-2 right-6 text-xs flex items-center gap-2"
              >
                {retryCount > 0 && (
                  <span className="text-yellow-400/70">
                    Retry #{retryCount}
                  </span>
                )}
                {lastError && (
                  <span className="text-red-400/70 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {lastError}
                  </span>
                )}
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  )
}