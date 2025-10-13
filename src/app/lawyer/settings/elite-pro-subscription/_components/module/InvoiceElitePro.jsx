import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  logo: { height: 20, width: 100, marginBottom: 10 },
  section: { marginBottom: 10 },
  bold: { fontWeight: 'bold' },
  right: { textAlign: 'right' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 4, paddingBottom: 4 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
});

// Format currency
const formatCurrency = (value, currency = 'usd') =>
  typeof value === 'number' ? (currency === 'usd' ? `$${value.toFixed(2)}` : `${value.toFixed(2)} ${currency.toUpperCase()}`) : '-';

const EliteProInvoiceDocument = ({ transaction }) => {
  if (!transaction) return null;

  const {
    createdAt,
    transactionId,
    userId,
    creditPackageId,
    subscriptionId,
    subscriptionType,
    amountPaid,
    couponCode,
    discountApplied,
    currency,
    invoice_pdf_url,
  } = transaction;

  const total = amountPaid || 0;
  const discount = discountApplied || 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.row}>
          {/* Customer Info */}
          <View style={styles.section}>
            <Text style={styles.bold}>{userId?.profile?.name || userId?.email}</Text>
            <Text>{userId?.companyName || userId?.email}</Text>
            <Text>
              {userId?.profile?.billingAddress
                ? `${userId.profile.billingAddress.addressLine1}, ${userId.profile.billingAddress.addressLine2}, ${userId.profile.billingAddress.city}, ${userId.profile.billingAddress.postcode}`
                : userId?.profile?.address?.replace(/,/g, ', ')}
            </Text>

            <Text style={[styles.bold, { marginTop: 50 }]}>
              Tax Invoice {transactionId?.slice(-6).toUpperCase()}
            </Text>
            <Text>{new Date(createdAt).toLocaleDateString()}</Text>
          </View>

          {/* Company Info */}
          <View style={[styles.section, styles.right]}>
            <Image style={styles.logo} src="/assets/img/logo.png" />
            <Text>Suite 8/3, Level 3/54 Jephson ST</Text>
            <Text>Toowong, QLD 4066, Australia</Text>
            <Text>+61 490 135 339</Text>
            <Text style={{ color: 'green', marginTop: 6 }}>✓ {transaction.status === 'completed' ? 'PAID' : 'PENDING'}</Text>
            <Text style={{ fontSize: 16, color: 'green' }}>{formatCurrency(total, currency)}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={[styles.section, { marginTop: 30 }]}>
          {/* Table Header */}
          <View style={[styles.row, styles.tableHeader]}>
            <Text style={{ flex: 2 }}>DETAILS</Text>
            <Text style={{ flex: 1 }}>PERIOD</Text>
            <Text style={{ flex: 1, textAlign: 'right' }}>PRICE</Text>
          </View>

          {/* Credit purchase */}
          {creditPackageId && (
            <View style={styles.tableRow}>
              <Text style={{ flex: 2 }}>Purchase of {creditPackageId?.credit} credits</Text>
              <Text style={{ flex: 1 }}>One-time charge</Text>
              <Text style={{ flex: 1, textAlign: 'right' }}>{formatCurrency(creditPackageId?.price, currency)}</Text>
            </View>
          )}

          {/* Subscription */}
          {subscriptionType === 'subscription' && subscriptionId?.eliteProPackageId && (
            <View style={styles.tableRow}>
              <Text style={{ flex: 2 }}>{subscriptionId.eliteProPackageId.name}</Text>
              <Text style={{ flex: 1 }}>
                {new Date(subscriptionId.eliteProPeriodStart).toLocaleDateString()} -{' '}
                {new Date(subscriptionId.eliteProPeriodEnd).toLocaleDateString()}
              </Text>
              <Text style={{ flex: 1, textAlign: 'right' }}>
                {formatCurrency(subscriptionId.eliteProPackageId.price?.amount || total, currency)}
              </Text>
            </View>
          )}

          {/* Discount */}
          {couponCode && (
            <View style={styles.tableRow}>
              <Text style={{ flex: 2 }}>{`Discount from coupon (${couponCode})`}</Text>
              <Text style={{ flex: 1 }}>-</Text>
              <Text style={{ flex: 1, textAlign: 'right', color: 'red' }}>- {formatCurrency(discount, currency)}</Text>
            </View>
          )}
        </View>

        {/* Summary */}
        <View style={[styles.section, styles.right, { marginTop: 20 }]}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
            Total: {formatCurrency(total, currency)}
          </Text>
        </View>

        {/* Optional Invoice PDF */}
        {/* {invoice_pdf_url && (
          <View style={[styles.section, { marginTop: 10 }]}>
            <Text>Invoice PDF: {invoice_pdf_url}</Text>
          </View>
        )} */}
      </Page>
    </Document>
  );
};

export default EliteProInvoiceDocument;
