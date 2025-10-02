import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';

interface RoleCardProps {
  role: Role;
  title: string;
  description: string;
  icon: string;
  onSelect: (role: Role) => void;
}

const RoleCard = ({ role, title, description, icon, onSelect }: RoleCardProps) => (
  <button
    onClick={() => onSelect(role)}
    className="group flex flex-col items-center justify-center space-y-3 rounded-2xl border border-border bg-surface p-8 text-center transition-all hover:border-primary hover:bg-primary/10"
  >
    <i className={`fas ${icon} text-5xl text-primary transition-transform group-hover:scale-110`}></i>
    <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
    <p className="text-text-secondary">{description}</p>
  </button>
);


const RoleSelector = () => {
  const { user, selectRole } = useAuth();

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
          Welcome, {user?.name}!
        </h1>
        <p className="mt-2 text-lg text-text-secondary">
          Please select your role to continue.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <RoleCard
            role="student"
            title="I'm a Student"
            description="Generate study content and take interactive quizzes."
            icon="fa-user-graduate"
            onSelect={selectRole}
          />
          <RoleCard
            role="parent"
            title="I'm a Parent"
            description="View your child's learning history and progress."
            icon="fa-user-shield"
            onSelect={selectRole}
          />
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;