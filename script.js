const signUpButton = document.getElementById('signUpButton');
const googleSignInButton = document.getElementById('googleSignInButton');
const facebookSignInButton = document.getElementById('facebookSignInButton');
const signInForm = document.getElementById('signIn'); // Ensure this ID matches your sign-in form
const signUpForm = document.getElementById('signup'); // Ensure this ID matches your sign-up form

signUpButton.addEventListener('click', function () {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
});

googleSignInButton.addEventListener('click', function () {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
});

facebookSignInButton.addEventListener('click', function () {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
});
