import React from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import RoleSelector from './components/RoleSelector';
import StudentDashboard from './components/StudentDashboard';
import ParentDashboard from './components/ParentDashboard';

const App = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (!role) {
    return <RoleSelector />;
  }

  return (
    <div>
      {role === 'student' ? <StudentDashboard /> : <ParentDashboard />}
    </div>
  );
};

export default App;