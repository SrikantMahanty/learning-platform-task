import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

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
const auth = getAuth(app);
const progressList = document.getElementById("progressList");

// Fetch user's enrolled courses and progress
const fetchProgress = async (userId) => {
    try {
        const querySnapshot = await getDocs(collection(db, "enrollments")); // Access the enrollments collection
        querySnapshot.forEach((doc) => {
            const enrollmentData = doc.data();
            if (enrollmentData.userId === userId) { // Check if the enrollment belongs to the user
                const courseId = enrollmentData.courseId;
                const totalLessons = enrollmentData.totalLessons || 1; // Ensure at least 1 lesson
                const completedLessons = enrollmentData.completedLessons || 0;

                const completionPercentage = Math.round((completedLessons / totalLessons) * 100); // Calculate completion percentage
                progressList.innerHTML += `
                    <div class="courseItem">
                        <h2>Course ID: ${courseId}</h2>
                        <p>Enrollment Status: ${enrollmentData.enrolled ? 'Enrolled' : 'Not Enrolled'}</p>
                        <p>Completion Status: ${enrollmentData.completed ? 'Completed' : 'In Progress'}</p>
                        <p>Completion Percentage: ${completionPercentage}%</p>
                        <button class="completeButton" onclick="markAsComplete('${doc.id}', '${courseId}')">Mark as Complete</button>
                    </div>
                `;
            }
        });
    } catch (error) {
        console.error("Error fetching progress:", error);
    }
};

// Mark course as complete
const markAsComplete = async (enrollmentId, courseId) => {
    try {
        const userId = auth.currentUser?.uid; // Get current user's ID
        if (!userId) {
            alert("No user is signed in.");
            return;
        }

        // Fetch the current enrollment data
        const enrollmentDoc = doc(db, "enrollments", enrollmentId);
        const enrollmentSnapshot = await getDoc(enrollmentDoc); // Use getDoc() to get a single document

        if (!enrollmentSnapshot.exists()) {
            console.error("Enrollment document not found");
            return;
        }

        const enrollmentData = enrollmentSnapshot.data();

        // Increment the completed lessons
        const completedLessons = (enrollmentData.completedLessons || 0) + 1; // Increment completed lessons
        const totalLessons = enrollmentData.totalLessons || 1; // Total lessons

        // Calculate new completion percentage
        const completionPercentage = Math.round((completedLessons / totalLessons) * 100); // Calculate new percentage

        // Update Firestore with the new completion data
        await setDoc(enrollmentDoc, {
            completedLessons: completedLessons,
            completionPercentage: completionPercentage,
            completed: completedLessons === totalLessons // Mark as complete if all lessons are done
        }, { merge: true });

        alert("Course marked as complete!");

        // Optional: Update the user's enrolledCourses for better tracking
        await setDoc(doc(db, "users", userId, "enrolledCourses", courseId), { completed: completedLessons === totalLessons }, { merge: true });

        // Refresh the progress list
        progressList.innerHTML = ''; // Clear current list
        fetchProgress(userId); // Refetch progress
    } catch (error) {
        console.error("Error marking course as complete:", error);
    }
};

// Attach markAsComplete to the window object
window.markAsComplete = markAsComplete;

// Monitor authentication state and fetch progress when a user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchProgress(user.uid); // Pass user ID to fetch enrolled courses and progress
    } else {
        alert("No user is signed in.");
    }
});
