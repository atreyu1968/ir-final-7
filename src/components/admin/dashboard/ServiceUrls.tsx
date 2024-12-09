import React from 'react';
import { ExternalLink, Copy } from 'lucide-react';
import { useDatabaseConfigStore } from '../../../stores/databaseConfigStore';
import { useChatConfigStore } from '../../../stores/chatConfigStore';
import { useForumConfigStore } from '../../../stores/forumConfigStore';
import { useCollaborationConfigStore } from '../../../stores/collaborationConfigStore';
import { useMeetingConfigStore } from '../../../stores/meetingConfigStore';

const ServiceUrls = () => {
  const [copied, setCopied] = React.useState<string | null>(null);
  const { config: dbConfig } = useDatabaseConfigStore();
  const { config: chatConfig } = useChatConfigStore();
  const { config: forumConfig } = useForumConfigStore();
  const { config: collaborationConfig } = useCollaborationConfigStore();
  const { config: meetingConfig } = useMeetingConfigStore();

  const services = [
    {
      name: 'Aplicación Principal',
      url: window.location.origin,
      port: 3000,
      status: 'active',
    },
    {
      name: 'Base de Datos',
      url: `${window.location.origin}/phpmyadmin`,
      port: 3000,
      status: dbConfig.enabled ? 'active' : 'inactive',
    },
    {
      name: 'Chat',
      url: chatConfig.settings.url,
      port: 3000,
      status: chatConfig.enabled ? 'active' : 'inactive',
    },
    {
      name: 'Foro',
      url: forumConfig.settings.url,
      port: 3000,
      status: forumConfig.enabled ? 'active' : 'inactive',
    },
    {
      name: 'Espacio Colaborativo',
      url: collaborationConfig.settings.url,
      port: 3000,
      status: collaborationConfig.enabled ? 'active' : 'inactive',
    },
    {
      name: 'Videoconferencias',
      url: meetingConfig.settings.url,
      port: 3000,
      status: meetingConfig.enabled ? 'active' : 'inactive',
    },
  ].filter(service => service.url);

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">URLs de Servicios</h3>

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.name}
            className="bg-white p-4 rounded-lg border flex items-center justify-between"
          >
            <div>
              <h4 className="font-medium">{service.name}</h4>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-600">
                  {service.url}
                </span>
                <div className="flex items-center ml-4 space-x-2">
                  <button
                    onClick={() => handleCopy(service.url)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Copiar URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Abrir en nueva pestaña"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${
                    service.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : service.status === 'inactive'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }
                `}
              >
                {service.status === 'active'
                  ? 'Activo'
                  : service.status === 'inactive'
                  ? 'Inactivo'
                  : 'Error'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {copied && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
          URL copiada al portapapeles
        </div>
      )}
    </div>
  );
};

export default ServiceUrls;