export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("L'image n'a pas pu etre lue."));
    image.src = dataUrl;
  });
}

export async function compressImage(file: File, maxWidth = 1600, quality = 0.82): Promise<string> {
  const dataUrl = await fileToDataUrl(file);
  const image = await loadImage(dataUrl);
  const ratio = Math.min(1, maxWidth / image.width);
  const width = Math.round(image.width * ratio);
  const height = Math.round(image.height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return dataUrl;

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
}

export function getImagePreview(dataUrl?: string) {
  return dataUrl || '';
}
