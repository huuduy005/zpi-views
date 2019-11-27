function parseJSON(response) {
    if (response.status === 204 || response.status === 205) {
        return null;
    }
    return response.json();
}

function request(url, options) {
    const requestOptions = {
        method: "GET",
        redirect: "follow",
        ...options
    };
    return fetch(url, requestOptions).then(parseJSON);
}

export default request;