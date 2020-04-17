(function () {
    if (getURLData('multiConnection') === 'true') {
        document.getElementById('error').innerHTML = 'Vous êtes déjà connecté sur ce navigateur dans une autre fenêtre !<br>Merci de vous déconnecter de l\'autre fenêtre avant de vous connecter sur celle-ci';
    }
})();