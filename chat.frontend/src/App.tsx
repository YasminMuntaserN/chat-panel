import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { ChatPanel } from './components/chat/ChatPanel';
import { SignalRProvider } from './context/SignalRContext';
import {ChatProvider} from "./context/ChatContext.tsx";

const queryClient = new QueryClient();


function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <SignalRProvider>
                    <Routes>
                        <Route
                            path="/chat/:userId"
                            element={
                                <ChatProvider>
                                    <div className="h-screen">
                                        <ChatPanel />
                                    </div>
                                </ChatProvider>
                            }
                        />
                    </Routes>
                </SignalRProvider>
            </Router>
        </QueryClientProvider>
    );
}

export default App;