import * as React from 'react';
import { Html, Head, Preview, Body, Container, Heading, Text, Section, Hr } from '@react-email/components';

export default function OrderEmail({ customerName, orderId, amount }: any) {
  return (
    <Html>
      <Head />
      <Preview>Your Aurora Order is Confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>AURORA.</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Thank you for shopping with us. Your order has been placed successfully.
            We are getting your premium items ready.
          </Text>
          
          <Section style={box}>
            <Text style={paragraph}>Order ID: <strong>#{orderId.slice(-6).toUpperCase()}</strong></Text>
            <Text style={paragraph}>Total Amount: <strong>₹{amount}</strong></Text>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>© 2024 Aurora Store. Defining Luxury.</Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, sans-serif' };
const container = { margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' };
const h1 = { color: '#000000', fontSize: '32px', fontWeight: 'bold', letterSpacing: '-1px', margin: '40px 0' };
const text = { color: '#333', fontSize: '16px', lineHeight: '26px' };
const box = { padding: '24px', backgroundColor: '#f4f4f5', borderRadius: '12px', margin: '24px 0' };
const paragraph = { fontSize: '14px', margin: '0', color: '#555' };
const hr = { borderColor: '#e6ebf1', margin: '20px 0' };
const footer = { color: '#8898aa', fontSize: '12px', textAlign: 'center' as const };