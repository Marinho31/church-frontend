import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Menu from './pages/Menu';
import MemberForm from './pages/MemberForm';
import MemberList from './pages/MemberList';
import Calendar from './pages/Calendar';
import EventList from './pages/EventList';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/members/new" element={<MemberForm />} />
        <Route path="/members/list" element={<MemberList />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
