// components/InvoiceDocument.js
import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  logo: { height: 20, width: 100, marginBottom: 10 },
  section: { marginBottom: 10 },
  bold: { fontWeight: 'bold' },
  right: { textAlign: 'right' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: 1,
    marginBottom: 4,
    paddingBottom: 4,
  },
});

const formatCurrency = (value) =>
  typeof value === 'number' ? `$${value.toFixed(2)}` : value || '-';

const InvoiceDocument = ({ transaction }) => {
  const { createdAt, _id, userId, creditPackageId, couponCode, discount } =
    transaction || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.row}>
          <View style={styles.section}>
            <Text style={styles.bold}>{userId?.profile?.name}</Text>
            <Text>{userId?.companyName || userId?.email}</Text>
            <Text>
              {userId?.profile?.billingAddress
                ? `${userId.profile.billingAddress.addressLine1}, ${userId.profile.billingAddress.addressLine2}, ${userId.profile.billingAddress.city}, ${userId.profile.billingAddress.postcode}`
                : userId?.profile?.address?.replace(/,/g, ', ')}
            </Text>
            <Text style={[styles.bold, { marginTop: 50 }]}>
              Tax Invoice {transaction?._id?.slice(-6).toUpperCase()}
            </Text>
            <Text>{new Date(createdAt).toLocaleDateString()}</Text>
          </View>

          {/* Company Info */}
          <View style={[styles.section, styles.right]}>
            <Image style={styles.logo} src="/assets/img/logo.png" />
            <Text>Suit 8/3, Level 3/54 Jephson ST</Text>
            <Text>Toowong, QLD 4066, Australia</Text>
            <Text>+61 490 135 339</Text>
            <Text style={{ color: 'green', marginTop: 6 }}>✓ PAID</Text>
            <Text style={{ fontSize: 16, color: 'green' }}>
              {formatCurrency(creditPackageId?.price)}
            </Text>
          </View>
        </View>

        <View>
          {/* Table */}
          <View style={[styles.section, { marginTop: 50 }]}>
            {/* Table Header */}
            <View style={[styles.row, styles.tableHeader]}>
              <Text style={{ flex: 2 }}>DETAILS</Text>
              <Text style={{ flex: 1 }}>PERIOD</Text>
              <Text style={{ flex: 1, textAlign: 'right' }}>PRICE</Text>
            </View>

            {/* Table Row */}
            <View style={styles.row}>
              <Text style={{ flex: 2 }}>
                Purchase of {creditPackageId?.credit} credits
              </Text>
              <Text style={{ flex: 1 }}>One-time charge</Text>
              <Text style={{ flex: 1, textAlign: 'right' }}>
                {formatCurrency(creditPackageId?.price)}
              </Text>
            </View>

            {/* Coupon Row */}
            {couponCode && (
              <View style={styles.row}>
                <Text
                  style={{ flex: 2 }}
                >{`Discount from coupon (${couponCode})`}</Text>
                <Text style={{ flex: 1 }}>-</Text>
                <Text style={{ flex: 1, textAlign: 'right', color: 'red' }}>
                  - {formatCurrency(discount)}
                </Text>
              </View>
            )}
          </View>

          {/* Summary */}
          <View style={[styles.section, styles.right]}>
            <Text style={{ fontSize: 14, fontWeight: 700 }}>
              Total: {formatCurrency(creditPackageId?.price)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        {/* <View style={[styles.section, { fontSize: 10, textAlign: 'center' }]}>
          <Text>The LawApp Online</Text>
          <Text>ABN: 83 642 968 947</Text>
          <Text>
            Registered Office: Level 2, 11 York Street, Sydney, NSW 2000
          </Text>
          <Text>Registered in Australia (ACN: 642 968 947)</Text>
          <Text>Registered with ASIC</Text>
        </View> */}
      </Page>
    </Document>
  );
};

export default InvoiceDocument;
