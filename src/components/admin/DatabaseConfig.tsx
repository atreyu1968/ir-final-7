import React, { useState } from 'react';
import { Save, TestTube, AlertCircle, Database } from 'lucide-react';
import { useDatabaseConfigStore } from '../../stores/databaseConfigStore';
import type { DatabaseConfig } from '../../types/admin';

const DatabaseConfig = () => {
  const { config, updateConfig, testConnection } = useDatabaseConfigStore();
  const [formData, setFormData] = useState<DatabaseConfig>(config);
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
          : 'Error al conectar con phpMyAdmin'
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

  const handleOpenPhpMyAdmin = () => {
    window.open(formData.settings.url, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Configuración de Base de Datos
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de phpMyAdmin
            </label>
            <input
              type="text"
              value={formData.settings.url}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, url: e.target.value }
              }))}
              placeholder="/phpmyadmin"
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tema
            </label>
            <select
              value={formData.settings.theme}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, theme: e.target.value as DatabaseConfig['settings']['theme'] }
              }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pmahomme">PMA Homme</option>
              <option value="original">Original</option>
              <option value="metro">Metro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Idioma por Defecto
            </label>
            <select
              value={formData.settings.defaultLanguage}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, defaultLanguage: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Límite de Subida
            </label>
            <input
              type="text"
              value={formData.settings.uploadLimit}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, uploadLimit: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Límite de Memoria
            </label>
            <input
              type="text"
              value={formData.settings.memoryLimit}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, memoryLimit: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiempo Máximo de Ejecución (segundos)
            </label>
            <input
              type="number"
              value={formData.settings.maxExecutionTime}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, maxExecutionTime: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="col-span-2 space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.settings.showServerInfo}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, showServerInfo: e.target.checked }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Mostrar información del servidor
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.settings.showPhpInfo}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, showPhpInfo: e.target.checked }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Mostrar información de PHP
              </span>
            </label>

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
                Habilitar gestión de base de datos
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
            onClick={handleOpenPhpMyAdmin}
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
  );
};

export default DatabaseConfig;