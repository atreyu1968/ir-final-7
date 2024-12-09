import React, { useState } from 'react';
import { X, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface PasswordChangeFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ onClose, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUserPassword } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword === user?.medusaCode) {
      setError('La nueva contraseña no puede ser igual al código Medusa');
      return;
    }

    setIsLoading(true);

    try {
      await updateUserPassword(newPassword);
      onSuccess();
    } catch (err) {
      setError('Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Cambiar Contraseña</h2>
          {!user?.passwordChangeRequired && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {user?.passwordChangeRequired && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Por seguridad, debes cambiar tu contraseña antes de continuar.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Repite la contraseña"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            {!user?.passwordChangeRequired && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeForm;