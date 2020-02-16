(function () {
    const socket = io.connect('http://localhost:4269');


    let userList = returnListConnectedUser();
    let pseudo = returnPseudo();
    const tempTab = userList.split(',');


    if (tempTab.some((user) => user === pseudo)) {
        socket.emit('newUserRequest', pseudo);
    }

    const tabUser = tempTab.filter(user => user !== pseudo);
    document.getElementById("pseudo").innerHTML += pseudo;
    let table = document.getElementById("tablePlayer");
    tabUser.forEach((user) => {
        addUserRow(user, table);
    });


    socket.on('newUserResponse', (user) => {
        if (!document.getElementById(user) && user !== pseudo) {
            addUserRow(user, table);
        }
    });

    socket.on('removeUserResponse', (user) => {
        if (document.getElementById(user)) {
            if (user !== pseudo) {
                table.removeChild(document.getElementById(user));
            }
        }
    });

    document.getElementById("deconnection").addEventListener('click', () => {
        socket.emit('removeUserRequest', pseudo);
        window.location = "http://localhost:4269/destroy";
    });
})();

function addUserRow(user, table) {
    let newRow = document.createElement("tr");
    let userCell = document.createElement("td");
    table.appendChild(newRow);
    newRow.appendChild(userCell);
    newRow.id = user.toString();
    userCell.innerHTML = user.toString();
}