import { toPng } from 'html-to-image';

export const copyChartToClipboard = async (elementId: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) return false;

    // Add white background and padding
    element.style.backgroundColor = '#ffffff';
    element.style.padding = '20px';

    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      quality: 1.0,
      pixelRatio: 2,
      style: {
        padding: '20px',
      },
    });

    // Reset styles
    element.style.backgroundColor = '';
    element.style.padding = '';

    // Create a temporary canvas to get blob data
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    ctx.drawImage(img, 0, 0);
    
    // Convert canvas to blob and copy to clipboard
    const blob = await new Promise<Blob | null>(resolve => 
      canvas.toBlob(resolve, 'image/png', 1.0)
    );
    
    if (!blob) return false;

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob
      })
    ]);

    return true;
  } catch (error) {
    console.error('Error copying chart:', error);
    return false;
  }
};

export const generateChartImage = async (elementId: string): Promise<string> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Chart element not found');

    // Add white background and padding for export
    element.style.backgroundColor = '#ffffff';
    element.style.padding = '20px';

    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      quality: 1.0,
      pixelRatio: 2,
      style: {
        padding: '20px',
      },
    });

    // Reset styles
    element.style.backgroundColor = '';
    element.style.padding = '';

    return dataUrl;
  } catch (error) {
    console.error('Error generating chart image:', error);
    throw error;
  }
};

export const optimizeChartForExport = (element: HTMLElement) => {
  // Add white background
  element.style.backgroundColor = '#ffffff';
  
  // Add padding
  element.style.padding = '20px';
  
  // Increase font sizes
  const texts = element.getElementsByTagName('text');
  for (let text of texts) {
    const currentSize = parseInt(text.style.fontSize || '12');
    text.style.fontSize = `${currentSize * 1.2}px`;
  }

  // Thicken lines and borders
  const paths = element.getElementsByTagName('path');
  for (let path of paths) {
    if (path.getAttribute('stroke-width')) {
      const currentWidth = parseFloat(path.getAttribute('stroke-width') || '1');
      path.setAttribute('stroke-width', (currentWidth * 1.5).toString());
    }
  }

  // Enhance colors for better contrast
  const colorElements = element.querySelectorAll('[fill]');
  colorElements.forEach(el => {
    const fill = el.getAttribute('fill');
    if (fill && fill !== 'none') {
      // Make colors more vibrant
      el.setAttribute('fill-opacity', '0.85');
    }
  });

  return () => {
    // Reset styles
    element.style.backgroundColor = '';
    element.style.padding = '';
    
    // Reset font sizes
    for (let text of texts) {
      text.style.fontSize = '';
    }
    
    // Reset line widths
    for (let path of paths) {
      path.setAttribute('stroke-width', '1');
    }
    
    // Reset colors
    colorElements.forEach(el => {
      el.removeAttribute('fill-opacity');
    });
  };
};