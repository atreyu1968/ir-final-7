import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar,
  ClipboardList,
  FileSpreadsheet,
  Settings,
  PlaySquare,
  Telescope,
  Book,
  MessageSquare,
  MessagesSquare,
  Video,
  FolderGit2
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useForumConfigStore } from '../../stores/forumConfigStore';
import { useDocsConfigStore } from '../../stores/docsConfigStore';
import { useChatConfigStore } from '../../stores/chatConfigStore';
import { useMeetingConfigStore } from '../../stores/meetingConfigStore';
import { useCollaborationConfigStore } from '../../stores/collaborationConfigStore';
import SidebarBranding from './SidebarBranding';

const Sidebar = () => {
  const { user } = useAuthStore();
  const { config: forumConfig } = useForumConfigStore();
  const { config: docsConfig } = useDocsConfigStore();
  const { config: chatConfig } = useChatConfigStore();
  const { config: meetingConfig } = useMeetingConfigStore();
  const { config: collaborationConfig } = useCollaborationConfigStore();

  const baseMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Cursos Académicos', path: '/academic-years' },
    { icon: ClipboardList, label: 'Registros Maestros', path: '/master-records' },
    { icon: Users, label: 'Usuarios', path: '/users' },
    { icon: PlaySquare, label: 'Acciones', path: '/actions' },
    { icon: FileSpreadsheet, label: 'Informes', path: '/reports' },
    { icon: Telescope, label: 'Observatorio', path: '/observatory' },
  ];

  const integrationMenuItems = [
    ...(forumConfig.enabled ? [{ icon: MessagesSquare, label: 'Foro', path: '/forum' }] : []),
    ...(chatConfig.enabled ? [{ icon: MessageSquare, label: 'Chat', path: '/chat' }] : []),
    ...(meetingConfig.enabled ? [{ icon: Video, label: 'Videoconferencias', path: '/meet' }] : []),
    ...(collaborationConfig.enabled ? [{ icon: FolderGit2, label: 'Espacio Colaborativo', path: '/collaboration' }] : []),
  ];

  const menuItems = [...baseMenuItems, ...integrationMenuItems];

  if (user?.role === 'admin') {
    menuItems.push({ icon: Settings, label: 'Administración', path: '/admin' });
  }

  return (
    <aside className="bg-gray-800 text-white w-64 flex-shrink-0 flex flex-col h-full">
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
          {docsConfig.enabled && (
            <li>
              <a
                href={docsConfig.settings.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-2 rounded-lg text-gray-300 hover:bg-gray-700"
              >
                <Book className="w-5 h-5" />
                <span>Documentación</span>
              </a>
            </li>
          )}
        </ul>
      </nav>
      
      <SidebarBranding />
    </aside>
  );
};

export default Sidebar;