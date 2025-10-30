// PrintProfile.jsx
import React, { useState } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ProfilePdfDocument from './ProfilePdfDocument';

export default function PrintProfile({ data, profilePicture }) {
  const [showPreview, setShowPreview] = useState(false);

  //   console.log('data in PrintProfile:', data);
  //   console.log('profilePicture in PrintProfile:', profilePicture);

  const handleOpenPreview = () => setShowPreview(true);
  const handleClosePreview = () => setShowPreview(false);

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h2 className="text-2xl font-semibold mb-6">Generate Profile PDF</h2>

      {/* ✅ Preview Button */}
      <button
        onClick={handleOpenPreview}
        style={{
          padding: '12px 24px',
          backgroundColor: '#111',
          color: '#fff',
          borderRadius: 6,
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Preview PDF
      </button>

      {/* ✅ Modal with PDF Preview */}
      {showPreview && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: '80%',
              height: '90vh',
              backgroundColor: '#fff',
              borderRadius: 8,
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* PDF Preview */}
            <div style={{ flex: 1 }}>
              <PDFViewer width="100%" height="100%">
                <ProfilePdfDocument
                  data={data}
                  profilePicture={profilePicture}
                />
              </PDFViewer>
            </div>

            {/* Actions */}
            <div
              style={{
                padding: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: '#f9f9f9',
                borderTop: '1px solid #ddd',
              }}
            >
              <PDFDownloadLink
                document={
                  <ProfilePdfDocument
                    data={data}
                    profilePicture={profilePicture}
                  />
                }
                fileName={`${data?.name || 'profile'}.pdf`}
                style={{
                  backgroundColor: '#111',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                {({ loading }) => (loading ? 'Preparing...' : 'Download PDF')}
              </PDFDownloadLink>

              <button
                onClick={handleClosePreview}
                style={{
                  backgroundColor: '#ccc',
                  color: '#111',
                  padding: '10px 20px',
                  borderRadius: 6,
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
