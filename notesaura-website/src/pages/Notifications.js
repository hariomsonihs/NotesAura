import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        let notificationsData = [];

        // Try user-specific notifications
        const userNotifRef = collection(db, 'users', user.uid, 'notifications');
        const userSnapshot = await getDocs(userNotifRef);

        if (!userSnapshot.empty) {
          notificationsData = userSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }

        // Also load general notifications
        const generalNotifRef = collection(db, 'notifications');
        const generalSnapshot = await getDocs(generalNotifRef);

        const generalNotifs = generalSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Combine and sort
        notificationsData = [...notificationsData, ...generalNotifs].sort((a, b) => {
          const timeA = a.timestamp?.toMillis?.() || a.createdAt?.toMillis?.() || 0;
          const timeB = b.timestamp?.toMillis?.() || b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });

        console.log('Loaded notifications:', notificationsData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit',
      month: 'short'
    });
  };

  const getNotificationIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'course':
      case 'new_course':
        return '📚';
      case 'admin':
      case 'announcement':
        return '📢';
      case 'payment':
        return '💳';
      case 'achievement':
        return '🏆';
      case 'reminder':
        return '⏰';
      default:
        return '🔔';
    }
  };

  const deleteNotification = async (notifId, isUserSpecific) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      if (isUserSpecific) {
        await deleteDoc(doc(db, 'users', user.uid, 'notifications', notifId));
      } else {
        await deleteDoc(doc(db, 'notifications', notifId));
      }
      setNotifications(notifications.filter(n => n.id !== notifId));
      alert('✅ Notification deleted!');
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('❌ Failed to delete');
    }
  };

  const clearAllNotifications = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!window.confirm('Clear all notifications?')) return;

    try {
      const userNotifRef = collection(db, 'users', user.uid, 'notifications');
      const snapshot = await getDocs(userNotifRef);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      setNotifications([]);
      alert('✅ All notifications cleared!');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      alert('❌ Failed to clear');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">🔔</div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="container">
        <div className="notifications-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="header-content">
            <div>
              <h1>🔔 Notifications</h1>
              <p>{notifications.length} notifications</p>
            </div>
            {notifications.length > 0 && (
              <button className="clear-all-btn" onClick={clearAllNotifications}>
                🗑️ Clear All
              </button>
            )}
          </div>
        </div>

        {notifications.length > 0 ? (
          <div className="notifications-list">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`notification-card card ${!notif.read ? 'unread' : ''}`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="notification-content">
                  <h3>{notif.title || notif.message || 'Notification'}</h3>
                  {notif.body && <p>{notif.body}</p>}
                  {notif.message && notif.title && <p>{notif.message}</p>}
                  <div className="notification-footer">
                    <span className="notification-time">
                      {formatDate(notif.timestamp || notif.createdAt)}
                    </span>
                    {notif.type && (
                      <span className="notification-type">{notif.type}</span>
                    )}
                  </div>
                </div>
                <button 
                  className="delete-notif-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id, notif.isUserSpecific !== false);
                  }}
                  title="Delete notification"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <div className="empty-icon">🔔</div>
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        )}

        <div style={{ height: '100px' }}></div>
      </div>
    </div>
  );
};

export default Notifications;
