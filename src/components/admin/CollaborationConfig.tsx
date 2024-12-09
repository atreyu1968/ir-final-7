import React, { useState } from 'react';
import { Save, TestTube, AlertCircle } from 'lucide-react';
import { useCollaborationConfigStore } from '../../stores/collaborationConfigStore';
import type { CollaborationConfig } from '../../types/admin';

const CollaborationConfig = () => {
  const { config, updateConfig, testConnection } = useCollaborationConfigStore();
  const [formData, setFormData] = useState<CollaborationConfig>(config);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const success = await testConnection();
      setTestResult({
        success,
        message: success 
          ? 'Conexión exitosa' 
          : 'Error al conectar con Nextcloud'
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Error al probar la conexión'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Configuración del Espacio Colaborativo
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de Nextcloud
            </label>
            <input
              type="url"
              value={formData.settings.url}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, url: e.target.value }
              }))}
              placeholder="https://nextcloud.ejemplo.com"
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario Administrador
            </label>
            <input
              type="text"
              value={formData.settings.adminUser}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, adminUser: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña Administrador
            </label>
            <input
              type="password"
              value={formData.settings.adminPassword}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, adminPassword: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuota por Defecto
            </label>
            <input
              type="text"
              value={formData.settings.defaultQuota}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, defaultQuota: e.target.value }
              }))}
              placeholder="5GB"
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grupo por Defecto
            </label>
            <input
              type="text"
              value={formData.settings.defaultGroup}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, defaultGroup: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secreto SSO
            </label>
            <input
              type="password"
              value={formData.settings.ssoSecret}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, ssoSecret: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  enabled: e.target.checked
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Habilitar espacio colaborativo
              </span>
            </label>
          </div>
        </div>
      </div>

      {testResult && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          testResult.success ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{testResult.message}</span>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleTestConnection}
          disabled={testing}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md disabled:opacity-50"
        >
          <TestTube className="w-5 h-5" />
          <span>{testing ? 'Probando...' : 'Probar Conexión'}</span>
        </button>
        
        <button
          type="submit"
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          <Save className="w-5 h-5" />
          <span>Guardar Cambios</span>
        </button>
      </div>
    </form>
  );
};

export default CollaborationConfig;