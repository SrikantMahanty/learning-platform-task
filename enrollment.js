import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
const coursesList = document.getElementById("coursesList");

// Fetch available courses and display them
const fetchCourses = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        querySnapshot.forEach((doc) => {
            const course = doc.data();
            const courseId = doc.id; // Store course ID
            coursesList.innerHTML += `
                <div class="courseItem">
                    <h2>${course.title}</h2>
                    <p>${course.description}</p>
                    <button class="enrollButton" data-course-id="${courseId}">Enroll</button>
                </div>
            `;
        });

        // Add event listener after the courses are rendered
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('enrollButton')) {
                const courseId = event.target.getAttribute('data-course-id');
                enrollCourse(courseId); // Call enrollCourse function
            }
        });

    } catch (error) {
        console.error("Error fetching courses:", error);
    }
};

// Enroll in a course
const enrollCourse = async (courseId) => {
    const userId = "mcWYuHCePmPDh2Es91Pp4pMAi8n2"; // Replace with actual user ID logic
    const enrollmentId = `${userId}_${courseId}_${Date.now()}`; // Generate a unique enrollment ID

    try {
        // Set the enrollment in the 'enrollments' collection
        await setDoc(doc(db, "enrollments", enrollmentId), {
            userId: userId,
            courseId: courseId,
            enrolled: true,
            enrollmentTimestamp: new Date().toISOString() // Optional: track when enrolled
        });

        // Update the course document to reflect that it has been enrolled in
        await setDoc(doc(db, "courses", courseId), {
            enrolled: true // This can also include other relevant info
        }, { merge: true });

        alert("Successfully enrolled in the course!");
    } catch (error) {
        console.error("Error enrolling in course:", error);
    }
};

// Fetch courses on page load
fetchCourses();
