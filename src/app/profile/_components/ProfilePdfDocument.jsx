import React, { useEffect, useState } from 'react';
import {
  Document,
  Page,
  Text,
  Image,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { convertWebpToPng } from '@/helpers/convertWebpToPng';
import Link from 'next/link';

// ✅ PDF styles (approximate your Tailwind layout)
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#fff',
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 10,
    color: '#00C3C0',
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 4,
  },
  designation: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  image: {
    width: 150,
    height: 200,
    borderRadius: 6,
    marginBottom: 10,
  },
  contactRow: {
    marginBottom: 4,
  },
  bold: {
    fontWeight: 600,
  },
  galleryContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 6, // spacing between images (works in latest react-pdf)
  },
  galleryImage: {
    width: '30%', // roughly 3 per row (with gaps)
    aspectRatio: 1,
    marginBottom: 6,
    borderRadius: 8,
  },
  videoLinkRow: {
    marginBottom: 6,
  },
  videoLink: {
    color: '#000',
    textDecoration: 'underline',
    fontSize: 12,
    wordBreak: 'break-all',
  },
});

export default function ProfilePdfDocument({ data }) {
  const [convertedImage, setConvertedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    if (data?.profilePicture?.endsWith('.webp')) {
      convertWebpToPng(data.profilePicture).then(setConvertedImage);
    } else {
      setConvertedImage(data?.profilePicture);
    }
    if (data?.photosVideos?.photos?.length > 0) {
      Promise.all(
        data.photosVideos.photos.map((imgUrl) =>
          convertWebpToPng(imgUrl).then((pngUrl) => {
            setGalleryImages((prev) => [...prev, pngUrl]);
          })
        )
      );
    }
  }, [data]);

  const extractYouTubeId = (url) => {
    const match =
      url.match(/(?:youtube\.com.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/) || [];
    return match[1] || '';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* --- Profile Banner --- */}
        <View style={styles.section}>
          {convertedImage && (
            <Image src={convertedImage} style={styles.image} />
          )}
          <Text style={styles.name}>{data?.name}</Text>
          <Text style={styles.designation}>
            {data?.designation || 'Lawyer'}
          </Text>
          <View>
            <Text style={styles.contactRow}>
              <Text style={styles.bold}>Email:</Text> {data?.email || 'N/A'}
            </Text>
            <Text style={styles.contactRow}>
              <Text style={styles.bold}>Phone:</Text> {data?.phone || 'N/A'}
            </Text>
            <Text style={styles.contactRow}>
              <Text style={styles.bold}>Address:</Text> {data?.address || 'N/A'}
            </Text>
          </View>
        </View>

        {/* --- Bio --- */}
        {data?.bio && (
          <View style={styles.section}>
            <Text style={styles.header}>About</Text>
            <Text>{data?.bio?.replace(/<[^>]+>/g, '')}</Text>
          </View>
        )}

        {/* --- Services --- */}
        {data?.customService?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.header}>Services</Text>
            {data.customService.map((s, i) => (
              <React.Fragment key={i}>
                <Text style={styles.bold}>• {s.title}</Text>
                <Text>{s.description}</Text>
              </React.Fragment>
            ))}
          </View>
        )}

        {/* --- Experience --- */}
        {data?.experience?.experience && (
          <View style={styles.section}>
            <Text style={styles.header}>Experience</Text>
            <Text>{data.experience.experience.replace(/<[^>]+>/g, '')}</Text>
          </View>
        )}

        {/* --- Experience --- */}
        {data?.experience?.experienceHighlight && (
          <View style={styles.section}>
            <Text style={styles.header}>Experience</Text>
            <Text>
              {data.experience.experienceHighlight.replace(/<[^>]+>/g, '')}
            </Text>
          </View>
        )}

        {/* --- Gallery --- */}
        {galleryImages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.header}>Photo Gallery</Text>
            <View style={styles.galleryContainer}>
              {galleryImages.map((img, i) => (
                <Image key={i} src={img} style={styles.galleryImage} />
              ))}
            </View>
          </View>
        )}

        {/* --- Videos --- */}
        {data?.photosVideos?.videos?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.header}>Videos</Text>
            {data.photosVideos.videos
              ?.filter(
                (v) =>
                  typeof v === 'string' &&
                  (v.includes('youtube.com') || v.includes('youtu.be'))
              )
              .map((v, i) => (
                <View key={i} style={styles.videoLinkRow}>
                  <Link href={v}>
                    <Text style={styles.videoLink}>{v}</Text>
                  </Link>
                </View>
              ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
