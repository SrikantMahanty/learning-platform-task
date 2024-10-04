import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

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
const storage = getStorage();

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
                        // Load profile picture if available
                        if (userData.profilePicture) {
                            document.getElementById('profilePic').src = userData.profilePicture;
                        }
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

// Edit Profile functionality
const editProfileButton = document.getElementById('editProfile');
const saveProfileButton = document.getElementById('saveProfile');
const fileUploadInput = document.getElementById('fileUpload');

// Show Save button when Edit button is clicked
editProfileButton.addEventListener('click', () => {
    const userInfoFields = document.querySelectorAll('.user-info span');
    userInfoFields.forEach(field => {
        field.contentEditable = true; // Make fields editable
        field.style.border = '1px solid #ced4da'; // Add border to editable fields
    });
    editProfileButton.style.display = 'none'; // Hide edit button
    saveProfileButton.style.display = 'block'; // Show save button
});

// Save Profile functionality
saveProfileButton.addEventListener('click', async () => {
    const userId = localStorage.getItem('loggedInUserId');
    const firstName = document.getElementById('loggedUserFName').innerText;
    const lastName = document.getElementById('loggedUserLName').innerText;
    const email = document.getElementById('loggedUserEmail').innerText;

    // Save changes to Firestore
    try {
        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, { firstName, lastName, email }, { merge: true });
        alert("Profile updated successfully!");
    } catch (error) {
        console.error("Error updating document: ", error);
    }

    // Handle profile picture upload
    if (fileUploadInput.files[0]) {
        const file = fileUploadInput.files[0];
        const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
        await uploadBytes(storageRef, file).then(async () => {
            const downloadURL = await getDownloadURL(storageRef);
            await setDoc(userDocRef, { profilePicture: downloadURL }, { merge: true });
            document.getElementById('profilePic').src = downloadURL; // Update profile picture
        });
    }

    // Reset editable fields
    const userInfoFields = document.querySelectorAll('.user-info span');
    userInfoFields.forEach(field => {
        field.contentEditable = false; // Make fields non-editable
        field.style.border = 'none'; // Remove border from fields
    });
    editProfileButton.style.display = 'block'; // Show edit button
    saveProfileButton.style.display = 'none'; // Hide save button
});

// Upload Profile Picture functionality
fileUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePic').src = e.target.result; // Show selected image
        };
        reader.readAsDataURL(file); // Read the file as a Data URL
    }
});
