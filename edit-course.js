import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
const db = getFirestore();

document.addEventListener('DOMContentLoaded', async () => {
    const courseId = new URLSearchParams(window.location.search).get('courseId');
    if (!courseId) {
        alert("No courseId provided.");
        return;
    }

    const docRef = doc(db, 'courses', courseId);
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('title').value = data.title || '';
            document.getElementById('category').value = data.category || '';
            document.getElementById('lessonContent').value = data.lessonContent || '';
            document.getElementById('description').value = data.description || '';
        } else {
            alert("Course not found!");
        }
    } catch (error) {
        console.error("Error fetching course details: ", error);
    }

    const editCourseForm = document.getElementById('editCourseForm');
    editCourseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            await updateDoc(docRef, {
                title: document.getElementById('title').value,
                category: document.getElementById('category').value,
                lessonContent: document.getElementById('lessonContent').value,
                description: document.getElementById('description').value,
            });
            alert("Course updated successfully.");
            window.location.href = 'courses.html';
        } catch (error) {
            console.error("Error updating course: ", error);
        }
    });
});
