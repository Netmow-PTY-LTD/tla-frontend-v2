export async function convertWebpToPng(webpUrl) {
  const img = await fetch(webpUrl).then((res) => res.blob());
  const bitmap = await createImageBitmap(img);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0);
  return canvas.toDataURL('image/png');
}
