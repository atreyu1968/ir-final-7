import React, { useState } from 'react';
import { Share2, Copy, Mail } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useRolesStore } from '../../stores/rolesStore';

const ShareActionButton = () => {
  const { user } = useAuthStore();
  const { roles } = useRolesStore();
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check if user has permission to share forms
  const userRole = roles.find(r => r.id === user?.role);
  const canShare = userRole?.permissions.some(p => 
    p.permissionId === 'actions' && p.actions.includes('share')
  );

  if (!user || !canShare) return null;

  // Generar token con información del usuario
  const token = btoa(JSON.stringify({
    id: user.id,
    center: user.center,
    network: user.network
  }));

  const shareUrl = `${window.location.origin}/shared/${token}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Registro de Acción - Red de Innovación FP');
    const body = encodeURIComponent(`
      Hola,
      
      Te comparto este enlace para registrar una acción en la Red de Innovación FP:
      ${shareUrl}
      
      Saludos
    `);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
      >
        <Share2 className="w-5 h-5" />
        <span>Compartir Formulario</span>
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">
                Compartir Formulario de Registro
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
                  />
                  <button
                    onClick={handleCopy}
                    className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>

                {copied && (
                  <p className="text-sm text-green-600">
                    ¡Enlace copiado!
                  </p>
                )}

                <button
                  onClick={handleEmailShare}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Mail className="w-5 h-5" />
                  <span>Compartir por Email</span>
                </button>
              </div>

              <button
                onClick={() => setShowDialog(false)}
                className="mt-6 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareActionButton;