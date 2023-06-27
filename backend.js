// BACK END //
// This entails exactly what it says it is: stuff in the back end. It takes
// the inputted service tag, and uses that to talk to GLPI's API.

// Preemptively hiding elements for visual appeal later on
let infoSection = document.getElementById("infoSection");
let searchSection = document.getElementById("searchSection");
let killConnectionButton = document.getElementById("kill_Connection");
let IDArray = [];
let modelArray = [];

infoSection.style.display = "none";
searchSection.style.display = "none";
killConnectionButton.style.display = "none";

// Declaring buttons beforehand
const getConnection = document.querySelector("#get_Connection");
const killSession = document.querySelector("#kill_Connection");
const tagLookup = document.querySelector("#search_By_Tag");
getConnection.onclick = () => {establishConnection()};
killSession.onclick = () => {killConnection(sessionToken)};
tagLookup.onclick = () => {searchByTag(sessionToken)};

// Declaring sessionToken as global; it's a surprise
// tool that'll help us later
var sessionToken;
var deviceCount = 1;

// Establishing connection and getting session token //
function establishConnection() {
    deviceCount = 1;
    console.log("Attempting connection...")
    const getToken = new Promise(function(resolve) {
        let userToken = document.getElementById("userToken").value;
        let finalHeader = "user_token ".concat(userToken);
        const prompt = document.getElementById("successOrFailPrompt");
        $.ajax({
            type: 'GET',
            url: "https://glpi.bdli.local/glpi/apirest.php/initSession",
            data: {},
            crossDomain: true,
            
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', finalHeader);
            },
            success: function(data){
                console.log("Connection successful");
                prompt.innerHTML = "Entry granted.";
                prompt.style.color = "#3F9C5F";
                document.getElementById("get_Connection").style.display = "none";
                killConnectionButton.style.display = "block";
                document.getElementById("buttonSection").innerHTML = '<button type="button" onclick="saveToCSV()" id="exportButton">Export to CSV</button>';
                infoSection.style.display = "inline";
                searchSection.style.display = "block";
                document.getElementById("userToken").style.display = "none";
                resolve(data);
            } ,
            error: function(data) {
                prompt.innerHTML = "Error occurred. Check the API key or blame Ryan for bad coding.";
                prompt.style.color = "#CC0000";
                console.log("Connection failed");
            }
        })
    })
    getToken.then((token) => {
        sessionToken = token.session_token;
    }) 
};

// Killing the granted session token //
function killConnection(sessionToken){
    prompt = document.getElementById("successOrFailPrompt");
    console.log("Attempting session kill...");
    $.ajax({
        type: 'GET',
        url: "https://glpi.bdli.local/glpi/apirest.php/killSession",
        data: {},
        dataType: 'text',
        crossDomain: true,
        
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Session-Token', sessionToken );
        },
        success: function(data){
            document.getElementById("get_Connection").style.display = "block";
            killConnectionButton.style.display = "none";
            searchSection.style.display = "none";
            console.log("Session killed successfully");
            prompt.innerHTML = "Session killed. Reenter API Token for access.";
            prompt.style.color = "#3F9C5F";
            document.getElementById("userToken").style.display = "block";
            //infoSection.style.display = "none";
        },
        error: function(){
            console.log("Session kill failed");
            prompt.innerHTML = "Could not kill session.";
            prompt.style.color = "#CC0000";
        }
    });
}

// Searching GLPI database for laptop based on serial ID //
function searchByTag(sessionToken){
    searchTerm = document.getElementById("searchTerm").value;

    // Accounting for blank search field
    if (searchTerm == "" || searchTerm == null) {
        alert("Enter a search term or blame Ryan for bad coding.");
    }
    else {
        console.log("Attempting search by serial " + searchTerm + "...");
        $.ajax({
            type: 'GET',
            url: 'https://glpi.bdli.local/glpi/apirest.php/search/Computer?is_deleted=0&as_map=0&criteria[0][link]=AND&criteria[0][field]=1&criteria[0][searchtype]=contains&criteria[0][value]=' + searchTerm + '&search=Search&itemtype=Computer&forcedisplay[0]=2',
            data: {},
            crossDomain: true,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Session-Token', sessionToken);
                xhr.setRequestHeader('Authorization', document.getElementById("userToken").value);
            },
            success: function(data){
                var json = data;
                // Got a response but no data
                if (json.data === undefined) {
                    console.log("Search unsuccessful");
                    alert("Could not get device info.");
                }
                else {
                    console.log("Search successful");
                    getInfo(sessionToken, json.data[0]["2"]);
                }
            }
        });
    }
}

// Grabbing the ID# for the chosen system via API endpoint //
function getInfo(sessionToken, itemID){
    
    itemID = itemID.toString(10);
    if (IDArray.includes(itemID)) {
        console.log("Existing entry for ID " + itemID + " detected; skipping entry")
        alert("Duplicate entry detected. Retry or blame Ryan for bad coding.");
    }
    else {
        console.log("Attempting info grab by ID " + itemID + "...");
        IDArray.push(itemID);
        $.ajax({
            type: 'GET',
            url: "https://glpi.bdli.local/glpi/apirest.php/Computer/" + itemID + "?expand_dropdowns=true&with_devices=true",
            data: {},
            crossDomain: true,
            
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Session-Token', sessionToken );
                xhr.setRequestHeader('Authorization', document.getElementById("userToken").value);
            },
            success: function(data){
                var json = data;
                console.log("Info grab successful");
                // No search result
                if (json.count == 0){
                    alert("No device found.");
                }
                else {
                    displayInfo(data);
                }
            }
        });
    }
}

// Information Display Function //
function displayInfo(data){
    var table = document.getElementById("infoTable");
    var row = table.insertRow(-1);
    // Writing all the stuff that there's (probably) only one of
    document.getElementById("serial").innerHTML = "Serial: " + data.serial;
    row.insertCell(0).innerHTML = data.serial;
    document.getElementById("manufacturer").innerHTML = "Manufacturer: " + data.manufacturers_id;
    row.insertCell(1).innerHTML = data.manufacturers_id;
    document.getElementById("model").innerHTML = "Model: " + data.computermodels_id;
    row.insertCell(2).innerHTML = data.computermodels_id;
    
    // Error handling for CPUs (because sometimes 
    // the CPUs aren't detected for some reason)
    try {
        let cpuKey = Object.keys(data._devices['Item_DeviceProcessor']);
        document.getElementById("cpu").innerHTML = "CPU: " + data._devices["Item_DeviceProcessor"][cpuKey]["deviceprocessors_id"];
        row.insertCell(3).innerHTML = data._devices["Item_DeviceProcessor"][cpuKey]["deviceprocessors_id"];
    }
    
    catch {
        document.getElementById("cpu").innerHTML = "CPU: No CPU found";
        row.insertCell(3).innerHTML = "No CPU found";
    }

    // RAM Info Display //
    try {
        let memKey = Object.keys(data._devices['Item_DeviceMemory']);
        document.getElementById("memory").innerHTML = "";

        // Accounting for more than one RAM module
        if(memKey.length > 1) {
            let memTotal = 0;
            for (var i = 0; i < memKey.length; i++){
                var currentMemSize = data._devices["Item_DeviceMemory"][memKey[i]]["size"];
                document.getElementById("memory").innerHTML += 
                "Memory " + (i+1) + ": " + currentMemSize + "mb<br>";
                memTotal += currentMemSize;
            }
            document.getElementById("memory").innerHTML += "Total memory: " + memTotal + "mb";
            row.insertCell(4).innerHTML = memTotal
        }
        // Exactly one RAM module
        else {
            document.getElementById("memory").innerHTML += 
            "Memory: " + data._devices["Item_DeviceMemory"][memKey]["size"];
            row.insertCell(4).innerHTML = data._devices["Item_DeviceMemory"][memKey]["size"];
        }
    }
    // Error handling
    catch {
        document.getElementById("memory").innerHTML = "No memory found";
        row.insertCell(4).innerHTML = "No memory found";
    }
    
    // HDD Info Display //
    try {
        const driveID = data._devices["Item_DeviceHardDrive"];
        driveKey = Object.keys(driveID);
        if (driveKey.length == 1) {
            document.getElementById("drive").innerHTML = driveID[driveKey]["deviceharddrives_id"]
            row.insertCell(5).innerHTML = driveID[driveKey]["deviceharddrives_id"];
        }
        else {
            console.log("More than 1 drive detected")
            let driveFinal;
            for(let i in driveKey) {
                if (i == 0) {
                    driveFinal = driveID[driveKey[i]]["deviceharddrives_id"];
                }
                else {
                    driveFinal += "; " + driveID[driveKey[i]]["deviceharddrives_id"].toString();
                }
            }
            document.getElementById("drive").innerHTML = "HDD: " + driveFinal;
            row.insertCell(5).innerHTML = driveFinal;
        }
    }
    catch (err) {
        console.log(err);
        document.getElementById("drive").innerHTML = "No drive found";
        row.insertCell(5).innerHTML = "No drive found";
    }   

    // Non-hardcoded fields for screen size and other notes //
    // Detecting same model entries; auto-fills screen size.
    let isPresent = 0;
    for (let i = 0; i < modelArray.length; i++) {
        if (modelArray[i][0] == data.computermodels_id) {
            console.log("Existing device " + data.computermodels_id + " discovered. Auto-filling screen size");
            isPresent = 1;
            row.insertCell(6).innerHTML = '<input type="text" id="ssize'  + deviceCount + '"/>';
            document.getElementById("ssize" + deviceCount).value = document.getElementById("ssize" + modelArray[i][1]).value;
            break;
        }
    }
    if (isPresent == 0) {
        console.log("New model " + data.computermodels_id + " detected");
        row.insertCell(6).innerHTML = '<input type="text" id="ssize'  + deviceCount + '"/>';
        modelArray.push([data.computermodels_id, deviceCount]);
    }
    row.insertCell(7).innerHTML = '<input type="text" id="notes'  + deviceCount + '"/>';
    deviceCount ++;
}

// Pre-arranging CSV file as array
function saveToCSV() {
    var savedNum = 0;
    var csv_data = [];
    var rows = document.getElementsByTagName('tr');

    for (var i = 0; i < rows.length; i++) {

        // Get each column data
        var cols = rows[i].querySelectorAll('td,th');
        
        // Stores each csv row data
        var csvrow = [];

        // Grabbing the info, conditionals for screen size and notes
        for (var j = 0; j < cols.length; j++) {
            if (j==6) {
                if (i==0){
                    csvrow.push("Screen Size");
                }
                else {
                    csvrow.push(document.getElementById("ssize" + (i)).value);
                }
            }
            else if (j==7) {
                if (i==0) {
                    csvrow.push("Notes");
                    console.log("pushed header");
                }
                else {
                    console.log("attempting push of notes" + (i) + " with value " + document.getElementById("notes" + savedNum).value)
                    csvrow.push(document.getElementById("notes" + (i)).value);
                }   
            }
            else {
                csvrow.push(cols[j].innerHTML);
            }        
        }

        // Combine each column value with comma
        csv_data.push(csvrow.join(","));
        savedNum ++;
    }

    // Combine each row data with new line character
    csv_data = csv_data.join('\n');
    downloadCSVFile(csv_data);

}

// Actually downloading the file
function downloadCSVFile(csv_data) {

    // Create CSV file object and feed
    // csv_data into it
    CSVFile = new Blob([csv_data], {
        type: "text/csv"
    });

    // Create to temporary link to initiate
    // download process
    var temp_link = document.createElement('a');

    // Download csv file
    let fileName = Date().slice(0, 24) + ".csv";
    fileName[22] = "-";
    fileName[19] = "-";
    temp_link.download = fileName;
    var url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;

    temp_link.style.display = "none";
    document.body.appendChild(temp_link);

    // Automatically click the link to
    // trigger download
    temp_link.click();
    document.body.removeChild(temp_link);
}
