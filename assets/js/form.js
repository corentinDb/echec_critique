let formRegistrationMod = (function () {
    return {
        checkEmail(email) {
            let reg = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,6}$/;
            if (!reg.test(email.value)) {
                document.getElementById("emailError").innerHTML = 'Email non valide !';
                return false;
            } else {
                document.getElementById("emailError").innerHTML = '';
                return true;
            }
        },

        checkPseudo(pseudo) {
            let reg = /^[a-zA-Z0-9_-]+$/;
            if (pseudo.value.length < 3) {
                document.getElementById("pseudoError").innerHTML = 'Pseudo trop court (3 caractères minimum)';
                return false;
            } else if (pseudo.value.trim() === '') {
                document.getElementById("pseudoError").innerHTML = 'Le pseudo ne doit pas être composé uniquement d\'espace';
                return false;
            } else if (!reg.test(pseudo.value)) {
                document.getElementById("pseudoError").innerHTML = 'Le pseudo ne doit pas être composé que de lettre (minuscule ou majuscule), de chiffre ou des caractères \'_\' ou \'-\'';
                return false;
            } else {
                document.getElementById("pseudoError").innerHTML = '';
                return true;
            }
        },

        checkPassword(pwd, confirmPwd) {
            if (pwd.value.length < 4) {
                document.getElementById("passwordError").innerHTML = 'Mot de passe trop court (4 caractères minimums)';
                return false;
            } else if (pwd.value !== confirmPwd.value) {
                document.getElementById("confirmPasswordError").innerHTML = 'Les mots de passe sont différents';
                return false;
            } else {
                document.getElementById("confirmPasswordError").innerHTML = '';
                document.getElementById("passwordError").innerHTML = '';
                return true;
            }
        },

        checkSubmit(formTab, socket) {
            let pseudoIsValid = formRegistrationMod.checkPseudo(formTab['pseudo']);
            let passwordLenghtIsValid = formRegistrationMod.checkPassword(formTab['password'], formTab['confirmPassword']);
            let passwordCorrespondenceIsValid = formRegistrationMod.checkPassword(formTab['password'], formTab['confirmPassword']);
            let emailIsValid = formRegistrationMod.checkEmail(formTab['email']);
            if (!pseudoIsValid || !passwordLenghtIsValid || !passwordCorrespondenceIsValid || !emailIsValid) {
                event.preventDefault();
                console.log('Formulaire non valide');
                    document.getElementById('errorReturn').innerHTML = 'Le formulaire n\'est pas valide !';
            } else {
                document.getElementById('errorReturn').innerHTML = '';
                console.log('Formulaire valide');
            }
        }
    }
})();