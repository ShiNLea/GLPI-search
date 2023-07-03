<script>
import { onMount } from 'svelte';

let passwordBar;
let sessionToken;
function establishConnection() {

async () => {
    console.log("Request sent with credentials ");
    const res = await fetch(
        'https://glpi.bdli.local/glpi/apirest.php/initSession',
        {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization':"user_token " + {passwordBar},
            }
        }
    ).then((output) => {
        
        if (output.ok) {
            console.log(output)
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
    sessionToken = await res.json()
}

}
</script>
<div class="login">
    <input type="password" id="userToken" bind:this = {passwordBar}/>
    <button type="button" id="submitToken" on:click={establishConnection}>Submit</button>

</div>