import { GITHUB_REPO } from '../config/constants';

export const checkForUpdates = async () => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/releases/latest`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const release = await response.json();
    const currentVersion = '1.0.0'; // Get from package.json in production

    // Compare versions
    if (release.tag_name.replace('v', '') > currentVersion) {
      // Parse changelog from release body
      const changelog = release.body
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.trim().substring(1).trim());

      return {
        version: release.tag_name,
        changelog,
        releaseDate: release.published_at,
        downloadUrl: release.zipball_url,
        size: '~25MB', // Estimate
        breaking: release.body.toLowerCase().includes('breaking change'),
      };
    }

    return null;
  } catch (error) {
    console.error('Error checking for updates:', error);
    throw error;
  }
};

export const downloadUpdate = async (url: string, onProgress: (progress: number) => void) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Download failed');
    
    const reader = response.body?.getReader();
    const contentLength = +(response.headers.get('Content-Length') || 0);
    
    if (!reader) throw new Error('Failed to start download');

    let receivedLength = 0;
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      receivedLength += value.length;
      
      const progress = (receivedLength / contentLength) * 100;
      onProgress(Math.round(progress));
    }

    return new Blob(chunks);
  } catch (error) {
    console.error('Error downloading update:', error);
    throw error;
  }
};