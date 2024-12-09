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
    // Mostrar mensaje de éxito y redireccionar a página de confirmación
    navigate('/shared/success');
  };

  return <SharedActionForm onSubmit={handleSubmit} />;
};