import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Payments.css';

const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // Try multiple possible collection structures
        let paymentsData = [];

        // Try 1: payments collection with userId field
        const paymentsRef = collection(db, 'payments');
        const q = query(paymentsRef, where('userId', '==', user.uid));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          paymentsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } else {
          // Try 2: user_payments subcollection
          const userPaymentsRef = collection(db, 'users', user.uid, 'payments');
          const snapshot2 = await getDocs(userPaymentsRef);
          paymentsData = snapshot2.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }

        // Sort by timestamp
        paymentsData.sort((a, b) => {
          const timeA = a.timestamp?.toMillis?.() || a.createdAt?.toMillis?.() || a.paymentDate?.toMillis?.() || 0;
          const timeB = b.timestamp?.toMillis?.() || b.createdAt?.toMillis?.() || b.paymentDate?.toMillis?.() || 0;
          return timeB - timeA;
        });

        console.log('Loaded payments:', paymentsData);
        setPayments(paymentsData);
      } catch (error) {
        console.error('Error loading payments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit',
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const copyPaymentDetails = (payment) => {
    const details = `
📋 Payment Details
━━━━━━━━━━━━━━━━━━━━
📚 Course: ${payment.courseName || payment.courseTitle || 'N/A'}
💰 Amount: ₹${payment.amount || payment.price || 0}
🆔 Transaction ID: ${payment.orderId || payment.transactionId || payment.paymentId || payment.id}
📅 Date: ${formatDate(payment.timestamp || payment.createdAt || payment.paymentDate)}
✅ Status: ${payment.status || 'Completed'}
${payment.paymentMethod ? `💳 Method: ${payment.paymentMethod}` : ''}
━━━━━━━━━━━━━━━━━━━━
    `.trim();
    
    navigator.clipboard.writeText(details);
    alert('✅ Payment details copied!');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">💳</div>
        <p>Loading payments...</p>
      </div>
    );
  }

  return (
    <div className="payments-page">
      <div className="container">
        <div className="payments-header">
          <button className="back-btn" onClick={() => navigate('/profile')}>
            ← Back
          </button>
          <h1>💳 My Payments</h1>
          <p>{payments.length} transactions</p>
        </div>

        {payments.length > 0 ? (
          <div className="payments-list">
            {payments.map((payment, index) => (
              <div key={`${payment.id}-${index}`} className="payment-card card">
                <div className="payment-header">
                  <div>
                    <h3>{payment.courseName || payment.courseTitle || payment.itemName || payment.productName || 'Course Payment'}</h3>
                    <p className="payment-id">
                      ID: {payment.orderId || payment.transactionId || payment.paymentId || payment.id}
                      <button 
                        className="copy-id-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(payment.orderId || payment.transactionId || payment.paymentId || payment.id);
                          alert('✅ Transaction ID copied!');
                        }}
                        title="Copy Transaction ID"
                      >
                        📋
                      </button>
                    </p>
                  </div>
                  <div className="payment-actions">
                    <div 
                      className="payment-status"
                      style={{ 
                        background: `${getStatusColor(payment.status)}20`,
                        color: getStatusColor(payment.status)
                      }}
                    >
                      {payment.status || 'Completed'}
                    </div>
                    <button 
                      className="copy-details-btn"
                      onClick={() => copyPaymentDetails(payment)}
                      title="Copy Payment Details"
                    >
                      📄 Copy
                    </button>
                  </div>
                </div>

                <div className="payment-details">
                  <div className="detail-row">
                    <span className="detail-label">📚 Course:</span>
                    <span className="detail-value">{payment.courseName || payment.courseTitle || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">💰 Amount:</span>
                    <span className="detail-value">₹{payment.amount || payment.price || 0}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📅 Date:</span>
                    <span className="detail-value">{formatDate(payment.timestamp || payment.createdAt || payment.paymentDate)}</span>
                  </div>
                  {payment.paymentMethod && (
                    <div className="detail-row">
                      <span className="detail-label">💳 Method:</span>
                      <span className="detail-value">{payment.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <div className="empty-icon">💳</div>
            <h3>No payments yet</h3>
            <p>Your payment history will appear here</p>
            <button className="btn-primary" onClick={() => navigate('/')}>
              Explore Courses
            </button>
          </div>
        )}

        <div style={{ height: '100px' }}></div>
      </div>
    </div>
  );
};

export default Payments;
