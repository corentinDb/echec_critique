let formConnectionMod = (function () {
    return {
        checkLogin(login) {     //Vérification de la validité du login
            let reg = /^[a-zA-Z0-9_-]+$/;
            if (login.value.length < 3) {
                document.getElementById("loginError").innerHTML = 'Le pseudo ne peux pas exister : trop court';
                return false;
            } else if (login.value.trim() === '') {
                document.getElementById("loginError").innerHTML = 'Le pseudo ne peut pas exister : composé uniquement d\'espace';
                return false;
            } else if (!reg.test(login.value)) {
                document.getElementById("loginError").innerHTML = 'Le pseudo ne peut pas exister : ne peut pas être composé que de lettre, de chiffre, de \'-\' ou de \'_\'';
                return false;
            } else {
                document.getElementById("loginError").innerHTML = '';
                return true;
            }
        },

        checkPasswordConnection(pwd) {      //Vérification de la validité du mot de passe
            if (pwd.value.length < 4) {
                document.getElementById("passwordError").innerHTML = 'Le mot de passe ne peut pas faire moins de 4 caractères';
                return false;
            } else {
                document.getElementById("passwordError").innerHTML = '';
                return true;
            }
        },

        checkSubmitConnection(login, pwd) {     //Vérification des informations avant l'envoi du formulaire
            let loginIsValid = formConnectionMod.checkLogin(login);
            let passwordIsValid = formConnectionMod.checkPasswordConnection(pwd);

            if (!loginIsValid && !passwordIsValid) {    //Si les informations ne sont pas valides, on bloque l'envoie du formulaire et on prévient l'utilisateur
                event.preventDefault();
                document.getElementById('errorReturn').innerHTML = 'Le formulaire n\'est pas valide !';
            }
        }
    }
})();
