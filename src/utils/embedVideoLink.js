// const extractYouTubeId = (url) => {
//   if (!url) return null;
//   const regExp =
//     /(?:youtube\.com\/(?:.*v=|(?:v|embed|shorts)\/)|youtu\.be\/)([\w-]{11})/;
//   const match = url.match(regExp);
//   return match?.[1] ?? null;
// };

// export const getEmbedUrl = (url) => {
//   if (!url) return null;

//   // YouTube
//   if (url.includes('youtube.com') || url.includes('youtu.be')) {
//     const videoId = extractYouTubeId(url);
//     return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
//   }

//   // Vimeo
//   const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
//   if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

//   // TikTok
//   if (url.includes('tiktok.com')) {
//     return `https://www.tiktok.com/embed/${encodeURIComponent(url)}`;
//   }

//   // Twitch
//   if (url.includes('twitch.tv/videos')) {
//     const match = url.match(/twitch\.tv\/videos\/(\d+)/);
//     return match
//       ? `https://player.twitch.tv/?video=${match[1]}&parent=yourdomain.com`
//       : null;
//   }

//   // Loom
//   if (url.includes('loom.com/share')) {
//     const match = url.match(/loom\.com\/share\/([\w-]+)/);
//     return match ? `https://www.loom.com/embed/${match[1]}` : null;
//   }

//   // Wistia
//   const wistiaMatch = url.match(/wistia\.com\/medias\/([\w]+)/);
//   if (wistiaMatch)
//     return `https://fast.wistia.com/embed/medias/${wistiaMatch[1]}`;

//   // Facebook
//   if (
//     url.includes('facebook.com/story.php') ||
//     url.includes('facebook.com/video.php') ||
//     url.includes('facebook.com/watch/')
//   ) {
//     return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
//       url
//     )}`;
//   }

//   return null;
// };

const extractYouTubeId = (url) => {
  if (!url) return null;
  const regExp =
    /(?:youtube\.com\/(?:.*v=|(?:v|embed|shorts)\/)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regExp);
  return match?.[1] ?? null;
};

export const getEmbedUrl = (url) => {
  if (!url) return null;

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // TikTok
  const tiktokMatch = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  if (tiktokMatch) {
    return `https://www.tiktok.com/embed/${tiktokMatch[1]}`;
  }

  // Twitch
  if (url.includes('twitch.tv/videos')) {
    const twitchMatch = url.match(/twitch\.tv\/videos\/(\d+)/);
    if (twitchMatch) {
      const domain =
        typeof window !== 'undefined'
          ? window.location.hostname
          : 'yourdomain.com'; // fallback for SSR
      return `https://player.twitch.tv/?video=${twitchMatch[1]}&parent=${domain}`;
    }
  }

  // Loom
  const loomMatch = url.match(/loom\.com\/share\/([\w-]+)/);
  if (loomMatch) {
    return `https://www.loom.com/embed/${loomMatch[1]}`;
  }

  // Wistia
  const wistiaMatch = url.match(/wistia\.com\/medias\/([\w]+)/);
  if (wistiaMatch) {
    return `https://fast.wistia.com/embed/medias/${wistiaMatch[1]}`;
  }

  // Facebook
  if (
    url.includes('facebook.com/story.php') ||
    url.includes('facebook.com/video.php') ||
    url.includes('facebook.com/watch/')
  ) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      url
    )}`;
  }

  // Unsupported or invalid
  return null;
};
