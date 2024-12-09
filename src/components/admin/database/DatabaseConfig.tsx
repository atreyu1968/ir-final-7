import React, { useState } from 'react';
import { Save, TestTube, AlertCircle, Database } from 'lucide-react';
import { useDatabaseConfigStore } from '../../../stores/databaseConfigStore';
import DatabaseStatus from './DatabaseStatus';
import type { DatabaseConfig } from '../../../types/admin';

const DatabaseConfig = () => {
  const { config, updateConfig, testConnection } = useDatabaseConfigStore();
  const [formData, setFormData] = useState<DatabaseConfig>(config);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const success = await testConnection(formData.settings);
      setTestResult({
        success,
        message: success 
          ? 'Conexión exitosa' 
          : 'Error al conectar con la base de datos'
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
    <div className="space-y-8">
      <DatabaseStatus />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Configuración de Base de Datos
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Host
              </label>
              <input
                type="text"
                value={formData.settings.host}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, host: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puerto
              </label>
              <input
                type="number"
                value={formData.settings.port}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, port: parseInt(e.target.value) }
                }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                type="text"
                value={formData.settings.user}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, user: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={formData.settings.password}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, password: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base de Datos
              </label>
              <input
                type="text"
                value={formData.settings.database}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, database: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Límite de Conexiones
              </label>
              <input
                type="number"
                value={formData.settings.connectionLimit}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, connectionLimit: parseInt(e.target.value) }
                }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                min="1"
                max="100"
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
                  Habilitar base de datos
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

          {formData.enabled && (
            <button
              type="button"
              onClick={() => window.open('/phpmyadmin', '_blank')}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
            >
              <Database className="w-5 h-5" />
              <span>Abrir phpMyAdmin</span>
            </button>
          )}
          
          <button
            type="submit"
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            <Save className="w-5 h-5" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DatabaseConfig;