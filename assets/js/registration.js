let formRegistrationMod = (function () {
    function escapeHtml(text) { //Fonction pour convertir les caractères spéciaux en entités HTML et pour retirer les epsaces avant et après le texte afin d'éviter les problèmes avec les noms
        let map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return text.replace(/[&<>"']/g, function (m) {
            return map[m];
        }).trim();
    }

    return {
        checkEmail(email) {
            let regExp = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
            if (!regExp.test(email.value)) {
                console.log("email faux !");
            }
        },

        checkPseudo(pseudo) {
            if (pseudo.value.length < 3) {
                console.log('pseudo trop court');
            } else if (pseudo.value.length > 16) {
                console.log('pseudo trop long');
            } else if(escapeHtml(pseudo.value) === ''){
                console.log('Le mot de passe ne peut pas être composé uniquement d\'espace');
            }
        },

        checkPasswordLength(pwd) {
            if (pwd.value.length < 4) {
                console.log('Mot de passe trop court');
            }
        },

        checkPasswordCorrespondence(pwd, confirmPwd) {
            if (pwd !== confirmPwd) {
                console.log('Mots de passe différents');
            }
        }
    }
})();

document.getElementById("userName").addEventListener('change', () => formRegistrationMod.checkPseudo(this));
document.getElementById("password").addEventListener('change', ()=> formRegistrationMod.checkPasswordLength(this));
document.getElementById("confirmPassword").addEventListener('change', ()=> formRegistrationMod.checkPasswordCorrespondence((this)));
document.getElementById("email").addEventListener('change', () => formRegistrationMod.checkEmail(this));