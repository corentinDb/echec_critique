function getURLData(param) {    //Fonction pour récupérer les paramètres GET d'une URL
    let listGET = {};
    window.location.href.replace(location.hash, '').replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function (m, key, value) { // callback
            listGET[key] = value !== undefined ? value : '';
        }
    );
    if (param) {
        return listGET[param] ? listGET[param] : null;
    }
    return listGET;
}