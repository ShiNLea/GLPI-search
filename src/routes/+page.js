
import { onMount } from 'svelte';

document.getElementById("submitButton").onclick = function() {establishConnection()};
function establishConnection() {

    onMount(async () => {
        const response = await fetch(
            'https://glpi.bdli.local/glpi/apirest.php/initSession',
            {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':"user_token " + document.getElementById("userToken"),
                }
            }
        ).then((output) => {
            if (output.ok) {
                return output.json();
            }
            throw new Error('Something went wrong. Retry or blame Ryan for bad coding.');
        })
        .then((responseJson)=> {
            console.log(responseJson);
            return responseJson.session_token;
        })
        .catch((error) => {
            console.log(error);
        })
    })
    console.log("Done");
}