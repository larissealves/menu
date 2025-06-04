import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App'

function Router() {
    return (
        <Routes>
            <Route path='/' element={<App />} />
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default Router;