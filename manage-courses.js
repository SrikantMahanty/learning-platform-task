import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
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
const db = getFirestore(app);

// Function to fetch and display courses
async function fetchCourses() {
    const coursesList = document.getElementById('coursesList');
    coursesList.innerHTML = ''; // Clear the list before fetching

    try {
        const coursesRef = collection(db, 'courses');
        const querySnapshot = await getDocs(coursesRef);

        querySnapshot.forEach((doc) => {
            const courseData = doc.data();
            const courseId = doc.id;

            // Create course item
            const courseItem = document.createElement('div');
            courseItem.classList.add('courseItem');
            courseItem.innerHTML = createCourseHTML(courseData, courseId);
            coursesList.appendChild(courseItem);
        });
    } catch (error) {
        console.error("Error fetching courses: ", error);
    }
}

// Helper function to create course HTML
function createCourseHTML(courseData, courseId) {
    return `
        <h3>${courseData.title}</h3>
        <div class="courseDetails">
            <div><strong>Category:</strong> ${courseData.category || 'N/A'}</div>
            <div><strong>Tags:</strong> ${courseData.tags?.join(', ') || 'N/A'}</div>
            <div><strong>Lesson Content:</strong> ${courseData.lessonContent || 'N/A'}</div>
            <div><strong>Description:</strong> ${courseData.description || 'N/A'}</div>
            <div><strong>Lecture Notes:</strong> ${courseData.lectureNotes || 'N/A'}</div>
            <div><strong>Quiz Title:</strong> ${courseData.quiz?.title || 'N/A'}</div>
            <div><strong>Quiz Questions:</strong> ${courseData.quiz?.questions.join(', ') || 'N/A'}</div>
            <div><strong>Created At:</strong> ${courseData.createdAt ? new Date(courseData.createdAt).toLocaleString() : 'N/A'}</div>
            <div><strong>Multimedia Links:</strong></div>
            <ul>
                <li><strong>Video URL:</strong> <a href="${courseData.multimedia?.videoURL || '#'}" target="_blank">${courseData.multimedia?.videoURL || 'N/A'}</a></li>
                <li><strong>Slideshow URL:</strong> <a href="${courseData.multimedia?.slideshowURL || '#'}" target="_blank">${courseData.multimedia?.slideshowURL || 'N/A'}</a></li>
                <li><strong>PDF URL:</strong> <a href="${courseData.multimedia?.pdfURL || '#'}" target="_blank">${courseData.multimedia?.pdfURL || 'N/A'}</a></li>
                <li><strong>Interactive Quiz URL:</strong> <a href="${courseData.multimedia?.interactiveQuizURL || '#'}" target="_blank">${courseData.multimedia?.interactiveQuizURL || 'N/A'}</a></li>
            </ul>
        </div>
        <div class="buttons">
            <button class="button editButton" onclick="editCourse('${courseId}')">Edit</button>
            <button class="button deleteButton" onclick="deleteCourse('${courseId}')">Delete</button>
        </div>
    `;
}

// Function to delete a course
window.deleteCourse = async function (courseId) {
    const confirmDelete = confirm('Are you sure you want to delete this course?');
    if (!confirmDelete) return; // Exit if user cancels

    try {
        await deleteDoc(doc(db, 'courses', courseId));
        alert('Course deleted successfully.');
        fetchCourses(); // Refresh the list after deletion
    } catch (error) {
        console.error("Error deleting course: ", error);
        alert('Failed to delete course. Please try again.');
    }
};

// Function to edit a course
window.editCourse = function (courseId) {
    window.location.href = `edit-course.html?courseId=${courseId}`;
};

// Fetch courses on page load
fetchCourses();
