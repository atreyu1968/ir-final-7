import { create } from 'zustand';
import type { MeetingConfig } from '../types/admin';

interface MeetingConfigState {
  config: MeetingConfig;
  updateConfig: (config: MeetingConfig) => void;
  generateMeetingUrl: () => Promise<string>;
}

const defaultConfig: MeetingConfig = {
  provider: 'jitsi-meet',
  settings: {
    url: '/meet',
    domain: 'meet.jitsi',
    roomPrefix: 'ri-fp-',
    configOverwrite: {
      startWithAudioMuted: true,
      startWithVideoMuted: true,
      enableWelcomePage: false,
      enableClosePage: false,
      disableDeepLinking: true,
    },
    interfaceConfigOverwrite: {
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      TOOLBAR_BUTTONS: [
        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
        'security'
      ],
    },
  },
  enabled: false,
};

export const useMeetingConfigStore = create<MeetingConfigState>((set, get) => ({
  config: defaultConfig,
  
  updateConfig: (config) => {
    set({ config });
    localStorage.setItem('meetingConfig', JSON.stringify(config));
  },
  
  generateMeetingUrl: async () => {
    const { config } = get();
    
    if (!config.enabled) {
      throw new Error('Video meetings are not enabled');
    }

    // Generate a unique room name
    const roomName = `${config.settings.roomPrefix}${Date.now()}`;
    
    // Build the meeting URL with configuration
    const url = new URL(`${config.settings.url}/${roomName}`);
    
    // Add configuration parameters
    const params = new URLSearchParams({
      config: JSON.stringify(config.settings.configOverwrite),
      interfaceConfig: JSON.stringify(config.settings.interfaceConfigOverwrite),
      userInfo: JSON.stringify({
        displayName: config.settings.userDisplayName,
        email: config.settings.userEmail,
        avatarURL: config.settings.userAvatar,
      }),
    });

    url.search = params.toString();
    return url.toString();
  },
}));