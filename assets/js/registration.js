(function () {
    let pseudo = document.getElementById("pseudo");
    let password = document.getElementById("password");
    let confirmPassword = document.getElementById("confirmPassword");
    let email = document.getElementById("email");

    let form = [];
    form['pseudo'] = pseudo;
    form['password'] = password;
    form['confirmPassword'] = confirmPassword;
    form['email'] = email;

    let error = getURLData('error');


    if(error === 'wrongPseudo'){
        document.getElementById('errorReturn').innerHTML = 'Pseudo déjà utilisé !';
    } else if (error === 'wrongEmail'){
        document.getElementById('errorReturn').innerHTML = 'Email déjà utilisé !';
    } else {
        document.getElementById('errorReturn').innerHTML = '';
    }

    if (error === 'undefined'){
        document.getElementById('errorReturn').innerHTML = 'Une erreur inconnue est survenue, merci de recommencer<br>Si cette erreur persiste, merci de contacter un admin';
    }

    pseudo.addEventListener('change', () => formRegistrationMod.checkPseudo(pseudo));
    password.addEventListener('change', () => formRegistrationMod.checkPassword(password, confirmPassword));
    confirmPassword.addEventListener('change', () => formRegistrationMod.checkPassword(password, confirmPassword));
    email.addEventListener('change', () => formRegistrationMod.checkEmail(email));
    document.getElementById("formRegistration").addEventListener('submit', () => formRegistrationMod.checkSubmit(form, socket));
})();
