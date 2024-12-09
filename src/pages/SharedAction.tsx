import React from 'react';
import { useNavigate } from 'react-router-dom';
import SharedActionForm from '../components/actions/SharedActionForm';
import { useActionsStore } from '../stores/actionsStore';
import type { Action } from '../types/action';

const SharedAction = () => {
  const navigate = useNavigate();
  const { addAction } = useActionsStore();

  const handleSubmit = (data: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>) => {
    addAction(data);
    navigate('/shared/success');
  };

  return <SharedActionForm onSubmit={handleSubmit} />;
};

export default SharedAction;