import { useEffect, useRef, useState } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import SectionCard from '../components/SectionCard';
import { createChatSession, sendChatMessage } from '../services/chatService';

export default function ChatPage({
    assessmentState,
    setAssessmentState,
    onBack
}) {
    const [status, setStatus] = useState('Preparing chat...');
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content:
                "Hello! I'm your CAD lifestyle assistant. Feel free to ask me about your assessment results or heart-healthy lifestyle recommendations."
        }
    ]);

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(
        assessmentState?.sessionId ?? null
    );
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [messages]);

    useEffect(() => {
        async function initializeChat() {
            if (!assessmentState) {
                setStatus('No assessment found.');
                return;
            }

            if (assessmentState.sessionId) {
                setStatus('Chat ready.');
                return;
            }

            try {
                const sessionId = await createChatSession(
                    assessmentState.assessment,
                    assessmentState.prediction.backendPrediction
                );

                setSessionId(sessionId);

                setAssessmentState({
                    ...assessmentState,
                    sessionId
                });

                setStatus('Chat ready.');
            } catch (error) {
                console.error(error);
                setStatus('Unable to start chat.');
            }
        }

        initializeChat();
    }, []);

    async function handleSend() {
        const message = input.trim();

        if (!message || loading) {
            return;
        }

        setMessages((previous) => [
            ...previous,
            {
                role: 'user',
                content: message
            }
        ]);

        setInput('');
        setLoading(true);

        try {
            console.log('Current assessmentState:', assessmentState);
            console.log('Current sessionId:', assessmentState.sessionId);
            const reply = await sendChatMessage(
                sessionId,
                message
            );

            setMessages((previous) => [
                ...previous,
                {
                    role: 'assistant',
                    content: reply
                }
            ]);
        } catch (error) {
            console.error(error);
            console.log(assessmentState.prediction);

            setMessages((previous) => [
                ...previous,
                {
                    role: 'assistant',
                    content:
                        'Sorry, something went wrong while contacting the AI service.'
                }
            ]);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    }

    return (
        <SectionCard
            title="AI Health Chatbot"
            description={status}
        >
            <div className="chat-messages">

                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`chat-message chat-message--${message.role}`}
                    >
                        <strong>
                            {message.role === 'assistant' ? 'AI' : 'You'}
                        </strong>

                        <p>{message.content}</p>
                    </div>
                ))}

                {loading && (
                    <div className="chat-message chat-message--assistant">
                        <strong>AI</strong>
                        <p>Typing...</p>
                    </div>
                )}

                <div ref={messagesEndRef} />

            </div>

            <textarea
                rows={3}
                value={input}
                placeholder="Ask about your assessment or heart health..."
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
            />

            <div className="form-actions">

                <PrimaryButton
                    variant="ghost"
                    onClick={onBack}
                >
                    Back
                </PrimaryButton>

                <PrimaryButton
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                >
                    Send
                </PrimaryButton>

            </div>
        </SectionCard>
    );
}