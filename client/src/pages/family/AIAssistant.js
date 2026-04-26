import { useState, useContext } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { askAI } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const AIAssistant = () => {
  const { user } = useContext(AuthContext);
  const userName = user?.name?.split(' ')[0] || 'Friend';

  const [chatMessages, setChatMessages] = useState([
    { type: 'assistant', text: "How can I help you today?\nYou can ask me anything about health, medications, symptoms, or general wellness." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;
    const userMessage = { type: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');
    setIsLoading(true);
    try {
      const response = await askAI({ prompt: currentInput });
      const aiResponse = response.data.answer || 'Sorry, I could not generate an answer.';
      setChatMessages(prev => [...prev, { type: 'assistant', text: aiResponse }]);
    } catch (error) {
      const serverMessage = error?.response?.data?.message || error?.message || 'Something went wrong.';
      const openAIErrorType = error?.response?.data?.error || 'unknown';
      const fallbackResponse = getEnhancedFallbackResponse(currentInput);
      const combinedResponse = openAIErrorType === 'RateLimit' || error?.response?.status === 429
        ? `⚠️ OpenAI quota limit reached: ${serverMessage}\n\n${fallbackResponse}`
        : fallbackResponse;
      setChatMessages(prev => [...prev, { type: 'assistant', text: combinedResponse }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getEnhancedFallbackResponse = (input) => {
    const l = input.toLowerCase();
    if (l.includes('medication') || l.includes('medicine') || l.includes('pill'))
      return "For medication management:\n\n1. Create a daily medication schedule\n2. Use pill organizers\n3. Set phone alarms for medication times\n4. Keep a medication log\n5. Store medications in a cool, dry place";
    if (l.includes('appointment') || l.includes('doctor'))
      return "For managing doctor appointments:\n\n1. Keep a medical calendar\n2. Set reminders 24 hours before\n3. Prepare a list of questions\n4. Bring all current medications\n5. Arrange transportation in advance";
    if (l.includes('exercise') || l.includes('walk'))
      return "Safe exercises for elderly:\n\n1. Walking: 15-30 minutes daily\n2. Chair exercises: seated leg lifts\n3. Balance exercises with support\n4. Gentle morning stretches\n5. Water aerobics (low-impact)";
    if (l.includes('diet') || l.includes('food') || l.includes('eat'))
      return "Nutrition tips:\n\n1. Eat 5-6 small meals daily\n2. Include protein: eggs, fish, beans\n3. Plenty of fruits and vegetables\n4. Stay hydrated: 6-8 glasses of water\n5. Limit salt and sugar";
    if (l.includes('sleep') || l.includes('rest'))
      return "For better sleep:\n\n1. Maintain consistent sleep schedule\n2. Create a relaxing bedtime routine\n3. Keep bedroom cool and dark\n4. Avoid screens 1 hour before bed\n5. Limit caffeine after 2 PM";
    if (l.includes('emergency') || l.includes('911'))
      return "⚠️ EMERGENCY:\n\nCall 911 immediately for:\n- Chest pain or difficulty breathing\n- Severe bleeding\n- Loss of consciousness\n- Stroke symptoms\n- Severe fall or injury";
    if (l.includes('heart') || l.includes('cardiac'))
      return "Heart-healthy foods:\n\n• Leafy greens (spinach, kale)\n• Berries (blueberries, strawberries)\n• Nuts and seeds (almonds, flaxseeds)\n• Fatty fish (salmon, mackerel)\n• Whole grains (oats, brown rice)\n• Olive oil and avocados\n\nThese foods help maintain healthy cholesterol levels and improve overall heart health.";
    return "I'm here to help with elderly care! I can assist with:\n\n💊 Medication management\n🏥 Health monitoring\n🏃 Exercise recommendations\n🍽️ Nutrition advice\n😴 Sleep improvement\n🚨 Emergency preparedness\n\nWhat would you like to know?";
  };

  const clearChat = () => setChatMessages([{ type: 'assistant', text: "How can I help you today?\nYou can ask me anything about health, medications, symptoms, or general wellness." }]);

  const quickActions = [
    { label: 'Health Advice', icon: '❤️', msg: 'Give me general health advice for elderly care' },
    { label: 'Medication Help', icon: '💊', msg: 'How should I manage medications for elderly care?' },
    { label: 'Symptom Checker', icon: '🩺', msg: 'What symptoms should I watch out for in elderly?' },
    { label: 'General Wellness', icon: '🌿', msg: 'Give me daily wellness tips for elderly' },
  ];

  const suggestions = [
    { icon: '📅', title: 'How can I improve sleep quality?', sub: 'Get tips for better sleep' },
    { icon: '🤝', title: 'What should I eat for strong immunity?', sub: 'Boost your immunity naturally' },
    { icon: '❤️', title: 'How to manage stress?', sub: 'Simple ways to reduce stress' },
    { icon: '🔔', title: 'When should I consult a doctor?', sub: 'Know the right time to seek help' },
  ];

  const suggestionChips = ['Tell me more', 'Other heart healthy tips', 'What to avoid?'];

  return (
    <DashboardLayout>
      <div style={s.page}>
        <div style={s.twoCol}>
          <div style={s.leftPanel}>
            <div style={s.welcomeCard}>
              <div style={s.robotEmoji}>🤖</div>
              <p style={s.welcomeTitle}>Hello {userName}! 🌟</p>
              <p style={s.welcomeSub}>I'm here to help you and your family stay healthy and safe.</p>
              <div style={s.qaGrid}>
                {quickActions.map((qa, i) => (
                  <button key={i} style={s.qaChip} onClick={() => setChatInput(qa.msg)}>
                    <span style={s.qaChipIcon}>{qa.icon}</span>
                    <span style={s.qaChipLabel}>{qa.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={s.sectionCard}>
              <p style={s.sectionLabel}>💡 Suggested for You</p>
              {suggestions.map((sg, i) => (
                <button key={i} style={s.suggRow} onClick={() => setChatInput(sg.title)}>
                  <div style={s.suggIcon}>{sg.icon}</div>
                  <div style={s.suggText}>
                    <p style={s.suggTitle}>{sg.title}</p>
                    <p style={s.suggSub}>{sg.sub}</p>
                  </div>
                  <span style={s.suggArrow}>›</span>
                </button>
              ))}
            </div>

            <div style={s.tipCard}>
              <p style={s.tipLabel}>🏆 Daily Tip</p>
              <p style={s.tipText}>Stay Hydrated — Drink at least 8 glasses of water throughout the day to keep your body and mind active.</p>
            </div>
          </div>

          <div style={s.rightPanel}>
            <div style={s.chatHeader}>
              <p style={s.chatTitle}>✦ AI Assistant</p>
              <button style={s.clearBtn} onClick={clearChat}>Clear</button>
            </div>

            <div style={s.messagesArea}>
              {chatMessages.map((msg, idx) => (
                <div key={idx}>
                  {msg.type === 'assistant' ? (
                    <div style={s.aiMsgRow}>
                      <div style={s.aiAvatar}>✦</div>
                      <div style={s.aiMsgBubble}><p style={s.msgText}>{msg.text}</p></div>
                    </div>
                  ) : (
                    <div style={s.userMsgRow}>
                      <div style={s.userMsgBubble}><p style={s.msgText}>{msg.text}</p></div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div style={s.aiMsgRow}>
                  <div style={s.aiAvatar}>✦</div>
                  <div style={s.aiMsgBubble}><p style={{ ...s.msgText, color: '#aaa', fontStyle: 'italic' }}>Thinking...</p></div>
                </div>
              )}
              {chatMessages.length > 1 && (
                <div style={s.suggChipsRow}>
                  {suggestionChips.map((chip, i) => (
                    <button key={i} style={s.suggChip} onClick={() => setChatInput(chip)}>{chip}</button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleChatSubmit} style={s.inputBar}>
              <input
                type="text"
                placeholder="Ask anything about health..."
                style={s.chatInput}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                disabled={isLoading}
              />
              <button type="submit" style={s.sendBtn} disabled={isLoading}>➤</button>
            </form>

            <p style={s.disclaimer}>AI Assistant provides general information only and is not a substitute for professional medical advice.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const s = {
  page: { padding: '4px 0' },
  twoCol: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'start' },
  leftPanel: { display: 'flex', flexDirection: 'column', gap: 14 },
  welcomeCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: '20px 18px' },
  robotEmoji: { fontSize: 40, marginBottom: 8, textAlign: 'center' },
  welcomeTitle: { fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 4 },
  welcomeSub: { fontSize: 12, color: '#666', marginBottom: 16, lineHeight: 1.5 },
  qaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  qaChip: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, backgroundColor: '#f7f7f7', border: '1px solid #e8e8e8', borderRadius: 12, padding: '12px 8px', cursor: 'pointer' },
  qaChipIcon: { fontSize: 22 },
  qaChipLabel: { fontSize: 11, fontWeight: 600, color: '#111', textAlign: 'center' },
  sectionCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: '16px 18px' },
  sectionLabel: { fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 12 },
  suggRow: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'none', border: 'none', padding: '10px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', textAlign: 'left' },
  suggIcon: { width: 36, height: 36, borderRadius: '50%', backgroundColor: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  suggText: { flex: 1 },
  suggTitle: { fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 2 },
  suggSub: { fontSize: 11, color: '#888' },
  suggArrow: { fontSize: 18, color: '#aaa' },
  tipCard: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: '16px 18px' },
  tipLabel: { fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 8 },
  tipText: { fontSize: 12, color: '#555', lineHeight: 1.6 },
  rightPanel: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  chatHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e8e8e8' },
  chatTitle: { fontSize: 15, fontWeight: 700, color: '#111' },
  clearBtn: { padding: '6px 14px', backgroundColor: '#f7f7f7', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#555', cursor: 'pointer' },
  messagesArea: { flex: 1, padding: 20, minHeight: 400, maxHeight: 520, overflowY: 'auto', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', gap: 14 },
  aiMsgRow: { display: 'flex', gap: 10, alignItems: 'flex-start' },
  aiAvatar: { width: 32, height: 32, borderRadius: '50%', backgroundColor: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 },
  aiMsgBubble: { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: '0 14px 14px 14px', padding: '12px 16px', maxWidth: '80%' },
  userMsgRow: { display: 'flex', justifyContent: 'flex-end' },
  userMsgBubble: { backgroundColor: '#e8e8e8', borderRadius: '14px 14px 0 14px', padding: '12px 16px', maxWidth: '80%' },
  msgText: { fontSize: 13, color: '#111', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 },
  suggChipsRow: { display: 'flex', gap: 8, flexWrap: 'wrap', paddingLeft: 42 },
  suggChip: { padding: '6px 14px', backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 20, fontSize: 12, color: '#555', cursor: 'pointer' },
  inputBar: { display: 'flex', gap: 10, padding: '16px 20px', borderTop: '1px solid #e8e8e8', backgroundColor: '#fff' },
  chatInput: { flex: 1, padding: '12px 16px', backgroundColor: '#f7f7f7', border: '1px solid #e8e8e8', borderRadius: 24, fontSize: 13, color: '#111', outline: 'none' },
  sendBtn: { width: 44, height: 44, borderRadius: '50%', backgroundColor: '#111', color: '#fff', border: 'none', fontSize: 16, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  disclaimer: { fontSize: 11, color: '#aaa', textAlign: 'center', padding: '8px 20px 14px', backgroundColor: '#fff', lineHeight: 1.5 },
};

export default AIAssistant;
