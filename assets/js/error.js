(function () {
    if (getURLData('multiConnection') === 'true') {     //Message d'erreur pour une mutli connexion sur le même navigateur
        document.getElementById('error').innerHTML = 'Vous êtes déjà connecté sur ce navigateur dans une autre fenêtre !<br>Merci de vous déconnecter de l\'autre fenêtre avant de vous connecter sur celle-ci';
    }
})();