(function () {
    let login = document.getElementById("login");
    let password = document.getElementById("password");

    document.getElementById('registration').addEventListener('click', () => {   //Bouton vers le formulaire d'inscription
        window.location = '/registration';
    });

    switch (getURLData('error')) {  //Traitement des messages d'erreur
        case 'wrongLogin':
            document.getElementById('errorReturn').innerHTML = 'Le login et le mot de passe ne correspondent pas !';
            break;
        case 'undefined':
            document.getElementById('errorReturn').innerHTML = 'Une erreur inconnue est survenue, merci de recommencer<br>Si cette erreur persiste, merci de nous contacter : nicolas.bouillet@isen.yncrea.fr';
            break;
        case 'existing':
            document.getElementById('errorReturn').innerHTML = 'Utilisateur déjà connecté sur ce serveur !';
            break;
        default :
            document.getElementById('errorReturn').innerHTML = '';
            break;
    }

    //Vérification des informations de connexion en direct
    login.addEventListener('change', () => formConnectionMod.checkLogin(login));
    password.addEventListener('change', () => formConnectionMod.checkPasswordConnection(password));
    //Vérification des informations de connexion lors de la soumission du formulaire
    document.getElementById("formRegistration").addEventListener('submit', () => formConnectionMod.checkSubmitConnection(login, password));
})();