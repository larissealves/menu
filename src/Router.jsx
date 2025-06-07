import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App'

import Settings from './pages/Settings';

function Router() {
    return (
        <Routes>
            <Route path='/' element={<App />} />
            <Route path='/settings' element={<Settings />} />

            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default Router;