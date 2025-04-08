import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Menu from './pages/Menu';
import MemberList from './pages/MemberList';
import MemberForm from './pages/MemberForm';
import EventList from './pages/EventList';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/menu" replace />} />
        
        {/* Rotas protegidas com Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="menu" element={<Menu />} />
          <Route path="members">
            <Route path="list" element={<MemberList />} />
            <Route path="new" element={<MemberForm />} />
            <Route path="edit/:id" element={<MemberForm />} />
          </Route>
          <Route path="events" element={<EventList />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
