(function () {
    const socket = io.connect('http://localhost:4269');

    const pseudo = document.getElementById('pseudo').innerHTML;
    const userID = Number(document.getElementById('userID').innerHTML);
    const existingConnection = document.getElementById('existingConnection').innerHTML === 'true';


    socket.emit('newUserRequest', pseudo);          //On prévient les autres users qu'on se connecte

    socket.on('close', (user) => {
        if (pseudo === user) {
            if (existingConnection) {
                window.location = 'http://localhost:4269/error?multiConnection=true';
            } else {
                window.location = 'http://localhost:4269/?error=existing';
            }
        }
    });

    socket.on('newUserRequest', (user) => {
        if (user === pseudo) {
            socket.emit('close', pseudo);
        }
    });

    socket.on('disconnect', () => {
        clearTimeout(timer);
        socket.on('connect', () => {
            window.location = 'http://localhost:4269';
        });
        document.getElementById('loading').innerHTML = 'Serveur deconnecté !';
    });

    let time = 0;
    let timer = setInterval(function () {
        let progressBar = document.getElementById('bar');
        progressBar.style.width = time + '%';
        progressBar.innerHTML = time + '%';
        progressBar.setAttribute('aria-valuenow', time.toString());
        if (time >= 100) {
            clearInterval(timer);
            let form = document.createElement("form");
            form.method = 'post';
            form.action = '/menu';

            let user = document.createElement("input");
            user.type = 'hidden';
            user.value = pseudo;
            user.name = 'user';

            let idInput = document.createElement("input");
            idInput.type = 'hidden';
            idInput.value = userID;
            idInput.name = 'userID';

            form.appendChild(user);
            form.appendChild(idInput);

            document.body.appendChild(form);
            form.submit();
        }
        let txt = document.getElementById('loading');
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