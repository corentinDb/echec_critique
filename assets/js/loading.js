(function () {
    const socket = io.connect('http://localhost:4269');

    //Récupération des infos
    const pseudo = document.getElementById('pseudo').innerHTML;
    const userID = document.getElementById('userID').innerHTML;
    const existingConnection = document.getElementById('existingConnection').innerHTML === 'true';


    //On prévient les autres users qu'on se connecte
    socket.emit('newUserRequest', pseudo);

    socket.on('close', (user) => {
        //Si l'utilisateur est déjà connecté...
        if (pseudo === user) {
            if (existingConnection) {
                //..sur le même navigateur : on le renvoie sur la page d'erreur
                window.location = 'http://localhost:4269/error?multiConnection=true';
            } else {
                //...sur un autre navigateur/ordinateur : on l'informe qu'il est déjà connecté
                window.location = 'http://localhost:4269/?error=existing';
            }
        }
    });

    //Force la fermeture si un utilisateur avec le même pseudo se connecte
    socket.on('newUserRequest', (user) => {
        if (user === pseudo) {
            socket.emit('close', pseudo);
        }
    });


    //Si le socket est déconnecté du serveur, on redirige vers la page principale
    socket.on('disconnect', () => {
        setTimeout(function () {
            document.getElementById('loadingTxt').innerHTML = 'Serveur deconnecté !';
            window.location = 'http://localhost:4269';
        }, 200);
    });

    //Annimation de la bar de progression
    let time = 0;
    let timer = setInterval(function () {
        let progressBar = document.getElementById('bar');
        progressBar.style.width = time + '%';
        progressBar.innerHTML = time + '%';
        progressBar.setAttribute('aria-valuenow', time.toString());
        if (time >= 100) {
            clearInterval(timer);
            setTimeout(function () {
                let form = document.createElement("form");
                form.method = 'post';
                form.action = '/loading';

                let user = document.createElement("input");
                user.type = 'hidden';
                user.value = pseudo;
                user.name = 'user';

                let idInput = document.createElement("input");
                idInput.type = 'hidden';
                idInput.value = userID;
                idInput.name = 'userID';

                let authorization = document.createElement("input");
                authorization.type = 'hidden';
                authorization.name = 'authorization';

                form.appendChild(user);
                form.appendChild(idInput);

                document.body.appendChild(form);
                form.submit();
            }, 500);
        }
        let txt = document.getElementById('loadingTxt');
        switch (time % 24) {
            case 0:
                txt.innerHTML = 'Loading.';
                break;
            case 8:
                txt.innerHTML = 'Loading..';
                break;
            case 16:
                txt.innerHTML = 'Loading...';
                break;
        }
        time++;
    }, 50);

})();