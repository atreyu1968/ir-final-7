import React, { useState } from 'react';
import { Save, TestTube, AlertCircle, Book } from 'lucide-react';
import { useDocsConfigStore } from '../../stores/docsConfigStore';
import type { DocsConfig } from '../../types/admin';

const DocsConfig = () => {
  const { config, updateConfig, testConnection } = useDocsConfigStore();
  const [formData, setFormData] = useState<DocsConfig>(config);
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
          : 'Error al conectar con GitBook'
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
          Configuración de la Documentación
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de GitBook
            </label>
            <input
              type="url"
              value={formData.settings.url}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, url: e.target.value }
              }))}
              placeholder="http://localhost:4000"
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={formData.settings.title}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, title: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <input
              type="text"
              value={formData.settings.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, description: e.target.value }
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
                Habilitar documentación
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
        
        <a
          href={formData.settings.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
        >
          <Book className="w-5 h-5" />
          <span>Ver Documentación</span>
        </a>
        
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

export default DocsConfig;