import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCBHKgdig2D6Fx4JnvYdLu9DNa9b4eaQSQ",
    authDomain: "web-learning-82e65.firebaseapp.com",
    projectId: "web-learning-82e65",
    storageBucket: "web-learning-82e65.appspot.com",
    messagingSenderId: "308555701491",
    appId: "1:308555701491:web:d5a02131c559d89421ab86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Authentication state listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        if (loggedInUserId) {
            const docRef = doc(db, "users", loggedInUserId);
            getDoc(docRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        document.getElementById('loggedUserFName').innerText = userData.firstName;
                        document.getElementById('loggedUserLName').innerText = userData.lastName;
                        document.getElementById('loggedUserEmail').innerText = userData.email;
                    } else {
                        console.log("No document found matching ID");
                    }
                })
                .catch((error) => {
                    console.error("Error getting document:", error);
                });
        } else {
            console.log("User ID not found in local storage");
        }
    } else {
        console.log("User not logged in");
    }
});

// Logout functionality
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
});

// Function to handle course submission
const handleCourseSubmission = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    const courseTitle = document.querySelector('input[placeholder="Course Title"]').value.trim();
    const courseDescription = document.querySelector('textarea[placeholder="Course Description"]').value.trim();
    const lessonContent = document.querySelector('input[placeholder="Lesson Content"]').value.trim();
    const quizTitle = document.querySelector('input[placeholder="Quiz Title"]').value.trim();
    const quizQuestions = document.querySelector('textarea[placeholder="Quiz Questions (comma-separated)"]').value
        .split(',')
        .map(q => q.trim())
        .filter(q => q); // Remove empty questions
    const category = document.querySelector('select').value;
    const tags = document.querySelector('input[placeholder="Tags (comma-separated)"]').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag); // Remove empty tags

    // Validate form data
    if (!courseTitle || !courseDescription || !lessonContent || !quizTitle || !quizQuestions.length || !category || !tags.length) {
        alert("Please fill out all fields correctly.");
        return;
    }

    // Get multimedia URLs and files
    const videoURL = document.querySelector('input[placeholder="Video URL"]').value.trim();
    const slideshowURL = document.querySelector('input[placeholder="Slideshow URL"]').value.trim();
    const pdfURL = document.querySelector('input[placeholder="PDF URL"]').value.trim();
    const interactiveQuizURL = document.querySelector('input[placeholder="Interactive Quiz URL"]').value.trim();
    const lectureNotes = document.querySelector('textarea[placeholder="Lecture Notes/Resources"]').value.trim();

    // Create course data object
    const courseData = {
        title: courseTitle,
        description: courseDescription,
        lessonContent,
        quiz: {
            title: quizTitle,
            questions: quizQuestions,
        },
        category,
        tags,
        multimedia: {
            videoURL,
            slideshowURL,
            pdfURL,
            interactiveQuizURL,
        },
        lectureNotes,
        createdAt: new Date(),
    };

    // Save course to Firestore
    try {
        const coursesRef = doc(db, "courses", courseTitle); // Use course title as document ID for simplicity
        await setDoc(coursesRef, courseData);
        alert("Course published successfully!");
        document.querySelector('.course-form').reset(); // Reset form fields after successful submission
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

// Add event listener to the course form
document.querySelector('.course-form').addEventListener('submit', handleCourseSubmission);
