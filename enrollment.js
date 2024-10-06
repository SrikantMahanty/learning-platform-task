// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
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

// Initialize Firebase, Firestore, and Authentication
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const coursesList = document.getElementById("coursesList");

// Variable to store the authenticated user's ID
let userId = null;

// Monitor the authentication state and get the current user's ID
onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid; // Assign the authenticated user's ID
        console.log("User ID:", userId);
    } else {
        console.log("No user is signed in.");
        alert("Please sign in to enroll in courses.");
    }
});

// Function to fetch available courses from Firestore
const fetchCourses = async () => {
    try {
        // Get all documents from the 'courses' collection
        const querySnapshot = await getDocs(collection(db, "courses"));

        // Loop through each course document and add it to the HTML
        querySnapshot.forEach((doc) => {
            const course = doc.data();
            const courseId = doc.id; // Store the document ID (course ID)

            // Render the course information into the coursesList container
            coursesList.innerHTML += `
                <div class="courseItem">
                    <h2>${course.title}</h2>
                    <p>${course.description}</p>
                    <button class="enrollButton" data-course-id="${courseId}">Enroll</button>
                </div>
            `;
        });

        // Add event listener to each "Enroll" button after rendering courses
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('enrollButton')) {
                const courseId = event.target.getAttribute('data-course-id');
                enrollCourse(courseId); // Enroll in the selected course
            }
        });

    } catch (error) {
        console.error("Error fetching courses:", error);
    }
};

// Function to enroll in a course
const enrollCourse = async (courseId) => {
    if (!userId) {
        alert("You need to be signed in to enroll in a course.");
        return;
    }

    const enrollmentId = `${userId}_${courseId}_${Date.now()}`; // Generate a unique enrollment ID

    try {
        // Create or update an enrollment document in the 'enrollments' collection
        await setDoc(doc(db, "enrollments", enrollmentId), {
            userId: userId,
            courseId: courseId,
            enrolled: true,
            enrollmentTimestamp: new Date().toISOString() // Optionally track enrollment timestamp
        });

        // Update the course document to indicate enrollment
        await setDoc(doc(db, "courses", courseId), {
            enrolled: true // Merging this data in Firestore, can be expanded with more details
        }, { merge: true });

        // Display a success alert to the user
        alert("Successfully enrolled in the course!");
    } catch (error) {
        console.error("Error enrolling in course:", error);
    }
};

// Fetch courses when the page loads
fetchCourses();
