import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { checkForUpdates, downloadUpdate } from '../../../services/updates';
import { GITHUB_REPO } from '../../../config/constants';

interface Update {
  version: string;
  changelog: string[];
  releaseDate: string;
  downloadUrl: string;
  size: string;
  breaking: boolean;
  status: 'available' | 'downloading' | 'installing' | 'completed' | 'error';
  error?: string;
}

const UpdateManager = () => {
  const [checking, setChecking] = useState(false);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    checkForUpdates().then(update => {
      if (update) {
        setUpdates([{
          ...update,
          status: 'available',
          changelog: update.changelog || []
        }]);
      }
    }).catch(err => {
      console.error('Error checking for updates:', err);
    });
  }, []);

  const handleCheckUpdates = async () => {
    setChecking(true);
    setError(null);
    
    try {
      const update = await checkForUpdates();
      
      if (update) {
        setUpdates([{
          ...update,
          status: 'available',
          changelog: update.changelog || []
        }]);
      } else {
        setUpdates([]);
      }
    } catch (err) {
      setError('Error al buscar actualizaciones');
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  const handleInstallUpdate = async (update: Update) => {
    try {
      // Update status to downloading
      setUpdates(prev => prev.map(u => 
        u.version === update.version 
          ? { ...u, status: 'downloading' }
          : u
      ));

      // Download update
      await downloadUpdate(update.downloadUrl, (downloadProgress) => {
        setProgress(downloadProgress);
      });

      // Update status to installing
      setUpdates(prev => prev.map(u => 
        u.version === update.version 
          ? { ...u, status: 'installing' }
          : u
      ));

      // Simulate installation progress
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Mark as completed
      setUpdates(prev => prev.map(u => 
        u.version === update.version 
          ? { ...u, status: 'completed' }
          : u
      ));

      // Reset progress
      setProgress(0);

      // Show success message
      alert('Actualización completada. La aplicación se recargará.');
      window.location.reload();
    } catch (err) {
      console.error('Error installing update:', err);
      setUpdates(prev => prev.map(u => 
        u.version === update.version 
          ? { ...u, status: 'error', error: 'Error en la instalación' }
          : u
      ));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Actualizaciones del Sistema</h3>
        <button
          onClick={handleCheckUpdates}
          disabled={checking}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
          <span>{checking ? 'Buscando...' : 'Buscar Actualizaciones'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.version}
            className="bg-white p-4 rounded-lg border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-medium">Versión {update.version}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Tamaño: {update.size}
                </p>
                <p className="text-sm text-gray-500">
                  Fecha: {new Date(update.releaseDate).toLocaleDateString()}
                </p>
              </div>

              {update.status === 'available' && (
                <button
                  onClick={() => handleInstallUpdate(update)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Instalar</span>
                </button>
              )}

              {(update.status === 'downloading' || update.status === 'installing') && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">
                    {update.status === 'downloading' ? 'Descargando...' : 'Instalando...'}
                  </span>
                </div>
              )}

              {update.status === 'completed' && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Instalado</span>
                </div>
              )}

              {update.status === 'error' && (
                <div className="flex items-center space-x-2 text-red-600">
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm">{update.error}</span>
                </div>
              )}
            </div>

            {(update.status === 'downloading' || update.status === 'installing') && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    {update.status === 'downloading' ? 'Descargando actualización...' : 'Instalando actualización...'}
                  </span>
                  <span className="text-gray-700 font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {update.breaking && (
              <div className="mt-4 flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Esta actualización contiene cambios importantes</span>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700">Cambios en esta versión:</h5>
              <ul className="mt-2 space-y-1">
                {update.changelog.map((change, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                    <span className="text-gray-400">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {updates.length === 0 && !checking && (
          <div className="text-center py-6 text-gray-500">
            No hay actualizaciones disponibles
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500">
        Repositorio: {GITHUB_REPO.owner}/{GITHUB_REPO.repo}
      </div>
    </div>
  );
};

export default UpdateManager;