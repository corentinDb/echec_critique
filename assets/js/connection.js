(function () {
    let login = document.getElementById("login");
    let password = document.getElementById("password");


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

    login.addEventListener('change', () => {
        let reg = /^[a-zA-Z0-9_-]+$/;
        if (login.value.length < 3) {
            document.getElementById("loginError").innerHTML = 'Le pseudo ne peux pas exister : trop court';
        } else if (login.value.trim() === '') {
            document.getElementById("loginError").innerHTML = 'Le pseudo ne peut pas exister : composé uniquement d\'espace';
        } else if (!reg.test(login.value)) {
            document.getElementById("loginError").innerHTML = 'Le pseudo ne peut pas exister : ne peut pas être composé que de lettre, de chiffre, de \'-\' ou de \'_\'';
        } else {
            document.getElementById("loginError").innerHTML = '';
        }
    });

    password.addEventListener('change', () => {
        if (password.value.length < 4) {
            document.getElementById("passwordError").innerHTML = 'Le mot de passe ne peut pas faire moins de 4 caractères';
        } else {
            document.getElementById("passwordError").innerHTML = '';
        }
    });

    document.getElementById("formRegistration").addEventListener('submit', () => {
        let reg = /^[a-zA-Z0-9_-]+$/;
        let validLogin = false;
        let validMDP = false;
        if (login.value.length < 3) {
            document.getElementById("loginError").innerHTML = 'Le pseudo ne peux pas exister : trop court';
        } else if (login.value.trim() === '') {
            document.getElementById("loginError").innerHTML = 'Le pseudo ne peut pas exister : composé uniquement d\'espace';
        } else if (!reg.test(login.value)) {
            document.getElementById("loginError").innerHTML = 'Le pseudo ne peut pas exister : ne peut pas être composé que de lettre, de chiffre, de \'-\' ou de \'_\'';
        } else {
            document.getElementById("loginError").innerHTML = '';
            validLogin = true;
        }
        if (password.value.length < 4) {
            document.getElementById("passwordError").innerHTML = 'Le mot de passe ne peut pas faire moins de 4 caractères';
        } else {
            validMDP = true;
        }
        if (validLogin && validMDP) {
            document.getElementById('errorReturn').innerHTML = '';
            document.getElementById("loginError").innerHTML = '';
            document.getElementById("passwordError").innerHTML = '';
        } else {
            event.preventDefault();
            document.getElementById('errorReturn').innerHTML = 'Le formulaire n\'est pas valide !';
        }
    });
})();