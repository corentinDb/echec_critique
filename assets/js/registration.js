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

    document.getElementById('return').addEventListener('click', () => { //Bouton retour vers la page de connexion
        window.location = '/';
    });


    switch (getURLData('error')) {     //Traitement des messages d'erreur
        case 'wrongPseudo':
            document.getElementById('errorReturn').innerHTML = 'Pseudo déjà utilisé !';
            break;
        case 'wrongEmail':
            document.getElementById('errorReturn').innerHTML = 'Email déjà utilisé !';
            break;
        case 'undefined':
            document.getElementById('errorReturn').innerHTML = 'Une erreur inconnue est survenue, merci de recommencer<br>Si cette erreur persiste, merci de contacter un admin';
            break;
        default:
            document.getElementById('errorReturn').innerHTML = '';
            break;
    }

    //Vérification des informations de connexion en direct
    pseudo.addEventListener('change', () => formRegistrationMod.checkPseudo(pseudo));
    password.addEventListener('change', () => formRegistrationMod.checkPassword(password, confirmPassword));
    confirmPassword.addEventListener('change', () => formRegistrationMod.checkPassword(password, confirmPassword));
    email.addEventListener('change', () => formRegistrationMod.checkEmail(email));
    //Vérification des informations de connexion lors de la soumission du formulaire
    document.getElementById("formRegistration").addEventListener('submit', () => formRegistrationMod.checkSubmit(form));
})();
