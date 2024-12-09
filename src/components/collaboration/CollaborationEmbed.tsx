import React, { useEffect, useState } from 'react';
import { useCollaborationConfigStore } from '../../stores/collaborationConfigStore';
import { useAuthStore } from '../../stores/authStore';
import { FolderGit2, AlertCircle } from 'lucide-react';

const CollaborationEmbed = () => {
  const { config } = useCollaborationConfigStore();
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.enabled) {
      setError('El espacio colaborativo no está habilitado. Contacte con el administrador.');
      return;
    }

    if (!config.settings.url) {
      setError('La URL del espacio colaborativo no está configurada.');
      return;
    }

    // En producción, aquí se generaría el token SSO
    const ssoToken = btoa(JSON.stringify({
      external_id: user?.id,
      name: `${user?.name} ${user?.lastName}`,
      email: user?.email,
      groups: [user?.role, user?.center].filter(Boolean),
      quota: config.settings.defaultQuota,
    }));

    // Redirigir a Nextcloud con SSO
    window.location.href = `${config.settings.url}/index.php/apps/sso_provider/sso?token=${ssoToken}`;
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
            No se puede acceder al espacio colaborativo
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
            <FolderGit2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <p className="text-gray-500">Conectando con el espacio colaborativo...</p>
      </div>
    </div>
  );
};

export default CollaborationEmbed;