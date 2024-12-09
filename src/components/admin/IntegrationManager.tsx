import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, AlertCircle, CheckCircle, Trash2, Download, ArrowUpCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { 
  installIntegration, 
  uninstallIntegration,
  toggleIntegration, 
  getIntegrationStatus,
  checkForUpdates,
  updateIntegration
} from '../../services/integrations';
import type { Integration, UpdateInfo } from '../../types/admin';

const IntegrationManager = () => {
  const { user } = useAuthStore();
  const [installing, setInstalling] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [uninstalling, setUninstalling] = useState<string | null>(null);
  const [updateInfo, setUpdateInfo] = useState<{[key: string]: UpdateInfo | null}>({});
  const [status, setStatus] = useState<{[key: string]: Integration['status']}>({});

  const integrations: Integration[] = [
    {
      id: 'nextcloud',
      name: 'Nextcloud',
      description: 'Plataforma de colaboración y almacenamiento de archivos',
      version: '26.0.0',
      status: status.nextcloud || { installed: false, running: false },
      requiredPorts: [8080],
      requiredMemory: 2,
      requiredDisk: 10
    },
    {
      id: 'rocketchat',
      name: 'Rocket.Chat',
      description: 'Sistema de chat en tiempo real',
      version: '5.4.0',
      status: status.rocketchat || { installed: false, running: false },
      requiredPorts: [3000],
      requiredMemory: 1,
      requiredDisk: 5
    },
    {
      id: 'discourse',
      name: 'Discourse',
      description: 'Foro de discusión',
      version: '2.1.8',
      status: status.discourse || { installed: false, running: false },
      requiredPorts: [9000],
      requiredMemory: 2,
      requiredDisk: 10
    },
    {
      id: 'jitsi',
      name: 'Jitsi Meet',
      description: 'Sistema de videoconferencias',
      version: 'stable-7648',
      status: status.jitsi || { installed: false, running: false },
      requiredPorts: [3478, 10000],
      requiredMemory: 4,
      requiredDisk: 5
    }
  ];

  // Check status periodically
  useEffect(() => {
    const updateStatus = async () => {
      for (const integration of integrations) {
        if (status[integration.id]?.installed) {
          const newStatus = await getIntegrationStatus(integration);
          setStatus(prev => ({
            ...prev,
            [integration.id]: newStatus
          }));
        }
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, [status]);

  // Check for updates periodically
  useEffect(() => {
    const checkUpdates = async () => {
      for (const integration of integrations) {
        if (status[integration.id]?.installed) {
          const updates = await checkForUpdates(integration);
          setUpdateInfo(prev => ({
            ...prev,
            [integration.id]: updates
          }));
        }
      }
    };

    checkUpdates();
    const interval = setInterval(checkUpdates, 24 * 60 * 60 * 1000); // Check daily
    return () => clearInterval(interval);
  }, [status]);

  const handleInstall = async (integration: Integration) => {
    try {
      setInstalling(integration.id);
      const success = await installIntegration(integration);
      
      if (success) {
        setStatus(prev => ({
          ...prev,
          [integration.id]: {
            installed: true,
            running: true,
            lastChecked: new Date().toISOString()
          }
        }));
      }
    } catch (error) {
      console.error('Error installing integration:', error);
      setStatus(prev => ({
        ...prev,
        [integration.id]: {
          ...prev[integration.id],
          error: 'Error durante la instalación'
        }
      }));
    } finally {
      setInstalling(null);
    }
  };

  const handleUninstall = async (integration: Integration) => {
    if (!confirm(`¿Está seguro de que desea desinstalar ${integration.name}? Esta acción eliminará todos los datos asociados.`)) {
      return;
    }

    try {
      setUninstalling(integration.id);
      const success = await uninstallIntegration(integration);
      
      if (success) {
        setStatus(prev => ({
          ...prev,
          [integration.id]: {
            installed: false,
            running: false,
            lastChecked: new Date().toISOString()
          }
        }));
        setUpdateInfo(prev => ({
          ...prev,
          [integration.id]: null
        }));
      }
    } catch (error) {
      console.error('Error uninstalling integration:', error);
      setStatus(prev => ({
        ...prev,
        [integration.id]: {
          ...prev[integration.id],
          error: 'Error durante la desinstalación'
        }
      }));
    } finally {
      setUninstalling(null);
    }
  };

  const handleUpdate = async (integration: Integration) => {
    const update = updateInfo[integration.id];
    if (!update) return;

    if (update.breaking && !confirm(`Esta actualización contiene cambios importantes que podrían afectar la compatibilidad. ¿Desea continuar?`)) {
      return;
    }

    try {
      setUpdating(integration.id);
      const success = await updateIntegration(integration);
      
      if (success) {
        setStatus(prev => ({
          ...prev,
          [integration.id]: {
            ...prev[integration.id],
            lastChecked: new Date().toISOString()
          }
        }));
        setUpdateInfo(prev => ({
          ...prev,
          [integration.id]: null
        }));
      }
    } catch (error) {
      console.error('Error updating integration:', error);
      setStatus(prev => ({
        ...prev,
        [integration.id]: {
          ...prev[integration.id],
          error: 'Error durante la actualización'
        }
      }));
    } finally {
      setUpdating(null);
    }
  };

  const handleToggle = async (integration: Integration) => {
    try {
      const action = status[integration.id].running ? 'stop' : 'start';
      const success = await toggleIntegration(integration, action);
      
      if (success) {
        setStatus(prev => ({
          ...prev,
          [integration.id]: {
            ...prev[integration.id],
            running: !prev[integration.id].running,
            lastChecked: new Date().toISOString()
          }
        }));
      }
    } catch (error) {
      console.error('Error toggling integration:', error);
      setStatus(prev => ({
        ...prev,
        [integration.id]: {
          ...prev[integration.id],
          error: 'Error al cambiar el estado'
        }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Gestión de Integraciones
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Instala y gestiona las aplicaciones integradas
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {integrations.map(integration => (
          <div
            key={integration.id}
            className="bg-white rounded-lg border shadow-sm p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {integration.name}
                  </h3>
                  {status[integration.id]?.installed && (
                    <span className="text-sm text-gray-500">
                      v{integration.version}
                    </span>
                  )}
                  {updateInfo[integration.id] && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      <ArrowUpCircle className="w-3 h-3 mr-1" />
                      v{updateInfo[integration.id]?.version} disponible
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {integration.description}
                </p>
                
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    Requisitos:
                  </p>
                  <ul className="text-sm text-gray-500 list-disc list-inside">
                    <li>Memoria: {integration.requiredMemory}GB RAM</li>
                    <li>Espacio: {integration.requiredDisk}GB</li>
                    <li>Puertos: {integration.requiredPorts.join(', ')}</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {status[integration.id]?.installed ? (
                  <>
                    <button
                      onClick={() => handleToggle(integration)}
                      className={`p-2 rounded-lg transition-colors ${
                        status[integration.id].running
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={status[integration.id].running ? 'Detener' : 'Iniciar'}
                    >
                      {status[integration.id].running ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleToggle(integration)}
                      className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      title="Reiniciar"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    {updateInfo[integration.id] && (
                      <button
                        onClick={() => handleUpdate(integration)}
                        disabled={updating === integration.id}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                        title="Actualizar"
                      >
                        <Download className="w-4 h-4" />
                        <span>
                          {updating === integration.id ? 'Actualizando...' : 'Actualizar'}
                        </span>
                      </button>
                    )}
                    <button
                      onClick={() => handleUninstall(integration)}
                      disabled={uninstalling === integration.id}
                      className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50"
                      title="Desinstalar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleInstall(integration)}
                    disabled={installing === integration.id}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <span>
                      {installing === integration.id ? 'Instalando...' : 'Instalar'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Status indicators */}
            <div className="mt-4 flex items-center space-x-4">
              {status[integration.id]?.installed && (
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Instalado</span>
                </div>
              )}
              
              {status[integration.id]?.running && (
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                  <span>En ejecución</span>
                </div>
              )}
              
              {status[integration.id]?.error && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>{status[integration.id].error}</span>
                </div>
              )}

              {status[integration.id]?.lastChecked && (
                <div className="text-xs text-gray-500">
                  Última comprobación: {new Date(status[integration.id].lastChecked!).toLocaleString()}
                </div>
              )}
            </div>

            {/* Update information */}
            {updateInfo[integration.id] && (
              <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800">
                  Actualización disponible: v{updateInfo[integration.id]?.version}
                </h4>
                <p className="mt-1 text-sm text-yellow-600">
                  Fecha de lanzamiento: {new Date(updateInfo[integration.id]?.releaseDate || '').toLocaleDateString()}
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium text-yellow-800">Cambios:</p>
                  <ul className="mt-1 text-sm text-yellow-600 list-disc list-inside">
                    {updateInfo[integration.id]?.changelog.map((change, index) => (
                      <li key={index}>{change}</li>
                    ))}
                  </ul>
                </div>
                {updateInfo[integration.id]?.breaking && (
                  <div className="mt-2 flex items-center text-sm text-yellow-800">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>Esta actualización contiene cambios importantes</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationManager;