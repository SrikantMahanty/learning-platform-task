import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCBHKgdig2D6Fx4JnvYdLu9DNa9b4eaQSQ",
    authDomain: "web-learning-82e65.firebaseapp.com",
    projectId: "web-learning-82e65",
    storageBucket: "web-learning-82e65.appspot.com",
    messagingSenderId: "308555701491",
    appId: "1:308555701491:web:d5a02131c559d89421ab86"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notificationList = document.getElementById("notificationList");
const userId = "mcWYuHCePmPDh2Es91Pp4pMAi8n2"; // Replace with actual user ID logic

// Fetch notifications for the user
const fetchNotifications = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "notifications"));
        notificationList.innerHTML = ""; // Clear the notification list
        querySnapshot.forEach((doc) => {
            const notificationData = doc.data();
            // Only show notifications for the current user
            if (notificationData.userId === userId) {
                notificationList.innerHTML += `
                    <div class="notificationItem ${notificationData.isRead ? 'read' : 'unread'}" onclick="markAsRead('${doc.id}')">
                        <h3>${notificationData.title}</h3>
                        <p>${notificationData.message}</p>
                        <small>${new Date(notificationData.timestamp.toMillis()).toLocaleString()}</small>
                    </div>
                `;
            }
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
};

// Mark notification as read
const markAsRead = async (notificationId) => {
    try {
        await updateDoc(doc(db, "notifications", notificationId), { isRead: true });
        fetchNotifications(); // Refresh the notifications list
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
};

// Call fetchNotifications on page load
fetchNotifications();
