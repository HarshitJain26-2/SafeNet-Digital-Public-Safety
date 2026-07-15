import { useState, useEffect, useRef } from 'react';
import { screens } from './screens';
import './App.css';

function App() {
  const [selectedScreen, setSelectedScreen] = useState(screens[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewportMode, setViewportMode] = useState('desktop');
  const [showCodeDrawer, setShowCodeDrawer] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(true);
  
  const [codeContent, setCodeContent] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello Marcus. Welcome to the SafeNet AI Intelligence Portal. I am your operational assistant. I can guide you through the features, architecture, and security protocols of the active node: **${screens[0].title}**.`,
      time: '19:54'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Categories list
  const categories = ['All', 'General', 'Citizen Portal', 'Officer Operations', 'Analytics & Forensics', 'Platform & Admin'];

  // Filtered screens
  const filteredScreens = screens.filter(screen => {
    const matchesSearch = screen.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          screen.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || screen.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Fetch screen code when selectedScreen changes
  useEffect(() => {
    const fetchScreenCode = async () => {
      setCodeLoading(true);
      try {
        const response = await fetch(`/screens/${selectedScreen.filename}`);
        if (!response.ok) {
          throw new Error('Failed to load screen source code');
        }
        const text = await response.text();
        // Remove markdown wrapper if it exists (e.g. if the file is served with header)
        setCodeContent(text);
      } catch (err) {
        setCodeContent(`<!-- Error loading code: ${err.message} -->\n\nFailed to fetch file: /screens/${selectedScreen.filename}`);
      } finally {
        setCodeLoading(false);
      }
    };
    fetchScreenCode();

    // Reset chat welcome message for the selected screen
    setChatMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: `Active Node switched to **${selectedScreen.title}**. This screen serves the **${selectedScreen.category}** layer. ${selectedScreen.description}\n\nWhat would you like to verify?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [selectedScreen]);

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Suggested questions based on screen category
  const getSuggestions = () => {
    const cat = selectedScreen.category;
    if (cat === 'General') {
      return [
        "What is the platform's core architecture?",
        "Who are the target user bases?",
        "How is security isolation maintained?"
      ];
    } else if (cat === 'Citizen Portal') {
      return [
        "How does the AI analyze scam calls?",
        "Where are citizen reports submitted?",
        "How do users verify threat scores?"
      ];
    } else if (cat === 'Officer Operations') {
      return [
        "How are cyber cases assigned?",
        "What evidence validation is used?",
        "How is the NCRB file generated?"
      ];
    } else if (cat === 'Analytics & Forensics') {
      return [
        "What nodes are mapped in the graph?",
        "How is counterfeit currency detected?",
        "Where is heatmap data gathered from?"
      ];
    } else if (cat === 'Platform & Admin') {
      return [
        "How do admins manage AI models?",
        "Where are audit trail logs stored?",
        "What system health metrics are tracked?"
      ];
    }
    return ["What is this screen's purpose?", "Tell me about key features."];
  };

  // Get pre-programmed answers
  const getAIAnswer = (question) => {
    const q = question.toLowerCase();
    
    // Global/General questions
    if (q.includes('architecture')) {
      return "SafeNet AI operates on a robust 3-layer architecture: (1) **Directive Layer** for markdown standard operating procedures, (2) **Orchestration Layer** for intelligent agent decision routing, and (3) **Execution Layer** containing deterministic Python and Node.js tasks for APIs and files.";
    }
    if (q.includes('target user') || q.includes('who')) {
      return "The platform serves two primary user spaces: **Citizens** (via tools like Scam Call Analyzer, Currency Detector, and Citizen Shield for threat checking) and **Law Enforcement Officers** (for case investigation, evidence archiving, geo-heatmap tracking, and operational dispatch).";
    }
    
    // Citizen Portal
    if (q.includes('scam call') || q.includes('analyze')) {
      return "The **Scam Call Analyzer** records live phone conversations or text transcripts. It runs speech-to-text conversion and queries a fine-tuned LLM classifier to flags indicators of impersonation, bank fraud tactics, and caller ID spoofing with high-confidence probability scores.";
    }
    if (q.includes('reports') || q.includes('track') || q.includes('dashboard')) {
      return "Citizen reports are securely filed on the **My Complaints Portal**. They sync directly to the **Citizen Dashboard**, where users track investigation stages, add media, and receive notifications if a flagged case is picked up by a Cyber Crime Unit.";
    }
    if (q.includes('verify threat') || q.includes('score')) {
      return "Citizen Shield runs domains, phone numbers, and UPI VPA addresses against threat databases and registrar records. A confidence score (e.g. 99.2%) is calculated based on WHOIS registration age, template pattern matches, and community reports.";
    }

    // Officer Operations
    if (q.includes('assign') || q.includes('cases')) {
      return "Incident dispatches are coordinated via the **Officer Management** center. It tracks active officers, their status (Available, Active, On Leave), and uses region-based routing to assign new cases to forensic analysts close to the reporting source.";
    }
    if (q.includes('evidence')) {
      return "The **Evidence Management** module logs file metadata, creates cryptographic sha-256 hashes of call recordings/documents, and archives them on secure cloud vaults to ensure chain of custody for prosecution.";
    }
    if (q.includes('ncrb')) {
      return "The system compiles investigation notes, suspect profiles, transaction logs, and evidence hashes into a standardized National Crime Records Bureau (NCRB) complaint format. This complaint file is directly generated and downloaded as a formatted PDF for instant filing.";
    }

    // Analytics & Forensics
    if (q.includes('nodes') || q.includes('graph')) {
      return "The **Fraud Network Graph** maps actors in a scam campaign. Nodes represent suspect IP addresses, bank account numbers, phone lines, and Aadhar details, while links show transaction flow direction and spoofing call relationships.";
    }
    if (q.includes('counterfeit') || q.includes('currency')) {
      return "The **Currency Detector** utilizes WebGL-accelerated computer vision. By analyzing images of banknotes, it checks security features like watermark alignments, color-shifting threads, security text, and intaglio ink patterns to flag fakes.";
    }
    if (q.includes('heatmap') || q.includes('map')) {
      return "The **Crime Heatmap** pulls real-time telemetry from geocoded citizen fraud reports. It clusters incident coordinates onto a leaflet-based geographical map of India to expose active local scam coordinates.";
    }

    // Platform & Admin
    if (q.includes('manage ai') || q.includes('models')) {
      return "Admins use the **AI Model Management** portal to track active model endpoints. It monitors inference latency, error rates, and GPU throughput, letting admins perform shadow deployments of newer checkpoints (e.g., call analysis v4).";
    }
    if (q.includes('audit') || q.includes('logs')) {
      return "Login actions, API keys, and data queries are recorded in the **Security & Access Control** logs. It writes tamper-proof audit trails with IP tracking, user agent info, and multi-factor authorization tokens.";
    }
    if (q.includes('health') || q.includes('infra') || q.includes('metrics')) {
      return "The **Infrastructure & DB Management** console displays system-level status. It charts CPU utilization, memory buffers, Redis cache hit rates, PostgreSQL connection pool queues, and database replication sync offsets.";
    }

    // Default fallback
    return `Regarding the **${selectedScreen.title}**: It is engineered to maintain high-performance enterprise public safety. The module employs glassmorphic design layers to prevent operator fatigue and conforms to the 8px linear grid system. For detailed execution scripts, please check the corresponding directives in [CLAUDE.md](file:///c:/Users/Harshit/Desktop/Projects/Hackathon/Et%20Ai%20Hackathon/CLAUDE.md).`;
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    
    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const responseText = getAIAnswer(text);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenNewTab = () => {
    window.open(`/screens/${selectedScreen.filename}`, '_blank');
  };

  const handleShareLink = () => {
    const absoluteUrl = window.location.origin + `/screens/${selectedScreen.filename}`;
    navigator.clipboard.writeText(absoluteUrl);
    alert(`Public Link Copied:\n${absoluteUrl}`);
  };

  return (
    <div className="app-container">
      {/* Ambient background decorations */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* Left Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <div className="logo-container">
            <span className="material-symbols-outlined">security</span>
          </div>
          <div>
            <h1 className="brand-title">SafeNet AI</h1>
            <p className="brand-subtitle">Public Safety Intel</p>
          </div>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <div className="search-wrapper">
            <span className="material-symbols-outlined">search</span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search intel screens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category filtering */}
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Screen list */}
        <div className="screen-list">
          {filteredScreens.length > 0 ? (
            filteredScreens.map(screen => (
              <div
                key={screen.id}
                className={`screen-item ${selectedScreen.id === screen.id ? 'active' : ''}`}
                onClick={() => setSelectedScreen(screen)}
              >
                <div className="screen-icon-box">
                  <span className="material-symbols-outlined">{screen.icon}</span>
                </div>
                <div className="screen-info">
                  <h4 className="screen-title">{screen.title}</h4>
                  <p className="screen-desc">{screen.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
              No intelligence nodes matched your query.
            </div>
          )}
        </div>
      </aside>

      {/* Main Display Area */}
      <main className="main-canvas">
        {/* Header Navigation */}
        <header className="header-nav glass-panel">
          <div className="header-left">
            <div className="breadcrumbs">
              <span>SafeNet AI</span>
              <span className="breadcrumbs-sep">/</span>
              <span>{selectedScreen.category}</span>
            </div>
            <h2 className="current-title">{selectedScreen.title}</h2>
          </div>

          {/* Viewport size controls */}
          <div className="header-center">
            <button
              className={`viewport-btn ${viewportMode === 'desktop' ? 'active' : ''}`}
              onClick={() => setViewportMode('desktop')}
              title="Desktop view"
            >
              <span className="material-symbols-outlined">desktop_windows</span>
              Desktop
            </button>
            <button
              className={`viewport-btn ${viewportMode === 'laptop' ? 'active' : ''}`}
              onClick={() => setViewportMode('laptop')}
              title="Laptop view (1280px)"
            >
              <span className="material-symbols-outlined">laptop</span>
              1280px
            </button>
            <button
              className={`viewport-btn ${viewportMode === 'tablet' ? 'active' : ''}`}
              onClick={() => setViewportMode('tablet')}
              title="Tablet view (768px)"
            >
              <span className="material-symbols-outlined">tablet_mac</span>
              768px
            </button>
            <button
              className={`viewport-btn ${viewportMode === 'mobile' ? 'active' : ''}`}
              onClick={() => setViewportMode('mobile')}
              title="Mobile view (390px)"
            >
              <span className="material-symbols-outlined">phone_iphone</span>
              390px
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="header-right">
            <button 
              className={`action-btn ${showCodeDrawer ? 'active' : ''}`}
              onClick={() => {
                setShowCodeDrawer(!showCodeDrawer);
                if (showChatDrawer && !showCodeDrawer) setShowChatDrawer(false); // Close chat if opening code to fit
              }}
              title="Toggle HTML Source Code View"
            >
              <span className="material-symbols-outlined">code</span>
            </button>
            <button 
              className={`action-btn ${showChatDrawer ? 'active' : ''}`}
              onClick={() => {
                setShowChatDrawer(!showChatDrawer);
                if (showCodeDrawer && !showChatDrawer) setShowCodeDrawer(false); // Close code if opening chat to fit
              }}
              title="Toggle AI Analyst chat"
            >
              <span className="material-symbols-outlined">support_agent</span>
            </button>
            <button className="action-btn" onClick={handleShareLink} title="Copy Public screen link">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className="action-btn" onClick={handleOpenNewTab} title="Open original screen in full page">
              <span className="material-symbols-outlined">open_in_new</span>
            </button>
          </div>
        </header>

        {/* Live Canvas Viewer */}
        <div className="iframe-outer-container">
          <div className={`iframe-container-wrapper mode-${viewportMode}`}>
            <div className="device-frame">
              <div className="device-header-bar">
                <div className="device-dots">
                  <div className="device-dot red"></div>
                  <div className="device-dot yellow"></div>
                  <div className="device-dot green"></div>
                </div>
                <span>{selectedScreen.title} - {viewportMode === 'desktop' ? '100%' : viewportMode === 'laptop' ? '1280 × 750' : viewportMode === 'tablet' ? '768 × 910' : '390 × 710'}</span>
                <div></div>
              </div>
              <div className="iframe-wrapper">
                <iframe
                  className="preview-iframe"
                  src={`/screens/${selectedScreen.filename}`}
                  title={selectedScreen.title}
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Details Footer */}
        <footer className="details-footer">
          <div className="details-footer-left">
            <span className="details-footer-title">Operational Description</span>
            <p className="details-footer-desc">{selectedScreen.description}</p>
          </div>
          <div className="details-footer-right">
            <div className="meta-pill">Node ID: {selectedScreen.id}</div>
            <div className="meta-pill">File: {selectedScreen.filename.split('_')[0]}.html</div>
          </div>
        </footer>
      </main>

      {/* Drawers Container (Code and Chat Panels) */}
      {(showCodeDrawer || showChatDrawer) && (
        <div className="drawers-container glass-panel">
          {/* Code Viewer Panel */}
          {showCodeDrawer && (
            <div className="code-drawer">
              <div className="drawer-header">
                <div className="drawer-title">
                  <span className="material-symbols-outlined">code</span>
                  HTML Source Code
                </div>
                <div className="code-header-actions">
                  <button className="copy-btn" onClick={handleCopyCode}>
                    <span className="material-symbols-outlined">{copied ? 'check' : 'content_copy'}</span>
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button className="close-drawer-btn" onClick={() => setShowCodeDrawer(false)}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
              
              {codeLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading source data...
                </div>
              ) : (
                <pre className="code-content">
                  <code>{codeContent}</code>
                </pre>
              )}
            </div>
          )}

          {/* AI Chat Analyst Panel */}
          {showChatDrawer && (
            <div className="chat-drawer">
              <div className="drawer-header">
                <div className="drawer-title">
                  <span className="material-symbols-outlined">auto_awesome</span>
                  AI Threat Analyst
                </div>
                <button className="close-drawer-btn" onClick={() => setShowChatDrawer(false)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Message scroll area */}
              <div className="chat-messages">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`chat-message ${msg.sender}`}>
                    <div className="msg-bubble">
                      {msg.text}
                    </div>
                    <span className="msg-timestamp">{msg.time}</span>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="chat-message ai">
                    <div className="msg-bubble" style={{ display: 'flex', gap: '4px', padding: '12px 18px', alignItems: 'center' }}>
                      <span className="material-symbols-outlined animate-spin" style={{ fontSize: '16px' }}>sync</span>
                      Analyzing data packets...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              <div className="chat-suggested">
                <div className="suggested-title">Suggested Inquiries</div>
                {getSuggestions().map((sug, index) => (
                  <button
                    key={index}
                    className="suggested-btn"
                    onClick={() => handleSendMessage(sug)}
                  >
                    {sug}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="chat-input-wrapper">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ask about active threat signature..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                />
                <button className="send-message-btn" onClick={() => handleSendMessage()}>
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Bubble to quickly launch/toggle Analyst Chat */}
      {!showChatDrawer && (
        <div 
          className="floating-agent-bubble" 
          onClick={() => {
            setShowChatDrawer(true);
            if (showCodeDrawer) setShowCodeDrawer(false);
          }}
          title="Open AI Analyst Chat"
        >
          <div className="ping-indicator">
            <div className="ping-animate"></div>
          </div>
          <span className="material-symbols-outlined">support_agent</span>
        </div>
      )}
    </div>
  );
}

export default App;
