import React, { useEffect, useState } from 'react';
import { useForumConfigStore } from '../../stores/forumConfigStore';
import { useAuthStore } from '../../stores/authStore';
import { MessageSquare, AlertCircle } from 'lucide-react';

const ForumEmbed = () => {
  const { config } = useForumConfigStore();
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.enabled) {
      setError('El foro no está habilitado. Contacte con el administrador.');
      return;
    }

    if (!config.settings.url) {
      setError('La URL del foro no está configurada.');
      return;
    }

    // En producción, aquí se generaría el token SSO
    const ssoToken = btoa(JSON.stringify({
      external_id: user?.id,
      name: `${user?.name} ${user?.lastName}`,
      email: user?.email,
      groups: [user?.role, user?.center].filter(Boolean),
    }));

    // Redirigir al foro con SSO
    window.location.href = `${config.settings.url}/session/sso_provider?sso=${ssoToken}`;
  }, [config, user]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se puede acceder al foro
          </h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full animate-pulse">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <p className="text-gray-500">Conectando con el foro...</p>
      </div>
    </div>
  );
};

export default ForumEmbed;