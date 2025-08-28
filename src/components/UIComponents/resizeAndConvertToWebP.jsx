// Resize AND convert/compress to WebP
const resizeAndConvertToWebP = (file, maxWidth = 500, quality = 0.8) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((maxWidth / width) * height);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const toBlobPromise = new Promise((res, rej) => {
          // Convert to WebP (supports transparency)
          canvas.toBlob(
            (blob) => (blob ? res(blob) : rej(new Error("Canvas toBlob failed"))),
            "image/webp",
            quality // 0–1 (lower = smaller file)
          );
        });

        toBlobPromise
          .then((blob) => {
            const webpFileName = file.name.replace(/\.\w+$/, "") + ".webp";
            resolve(new File([blob], webpFileName, { type: "image/webp" }));
          })
          .catch(reject);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });



  export default resizeAndConvertToWebP;