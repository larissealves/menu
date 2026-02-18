import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App'

import Settings from './pages/Settings';
import ProjectDocumentation from './pages/Doc';
import DatabaseSchema from './pages/DataBaseSchema';

function Router() {
    return (
        <Routes>
            <Route path='/' element={<App />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/ProjectDocumentation' element={<ProjectDocumentation />} />
            <Route path='/DataBaseSchema' element={<DatabaseSchema />} />

            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default Router;