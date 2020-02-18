(function () {
    let login = document.getElementById("login");
    let password = document.getElementById("password");

    document.getElementById('registration').addEventListener('click', () => {
        window.location = '/registration';
    });

    switch (getURLData('error')) {
        case 'wrongLogin':
            document.getElementById('errorReturn').innerHTML = 'Le login et le mot de passe ne correspondent pas !';
            break;
        case 'undefined':
            document.getElementById('errorReturn').innerHTML = 'Une erreur inconnue est survenue, merci de recommencer<br>Si cette erreur persiste, merci de contacter un admin';
            break;
        case 'existing':
            document.getElementById('errorReturn').innerHTML = 'Utilisateur déjà connecté sur ce serveur !';
            break;
        default :
            document.getElementById('errorReturn').innerHTML = '';
    }

    login.addEventListener('change', () => formConnectionMod.checkLogin(login));
    password.addEventListener('change', () => formConnectionMod.checkPasswordConnection(password));
    document.getElementById("formRegistration").addEventListener('submit', () => formConnectionMod.checkSubmitConnection(login, password));
})();