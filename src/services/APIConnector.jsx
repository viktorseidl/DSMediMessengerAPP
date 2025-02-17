import GetConnectorStr from "./encryption/connector/GetConnectorStr";

/**
 * Function to make the connection to the API as easy as possible
 * @param {object} appObj the App-Object needed to verify the origin of the request
 * @param {string} linkstring endpoint of the API
 * @param {object|null} subObj additional object, if needed
 * @param {object|null} subObj2 additional object, if needed
 * @returns API-response object
 * @author Sebastian Schaffrath
 */
export default async function apiConnect(appObj, linkstring,subObj=null, subObj2=null) {
    let objectArray = [appObj]; 
    if (subObj) objectArray.push(subObj); // Add subObj if provided
    if (subObj2) objectArray.push(subObj2); // Add subObj2 if provided
    
    const req = {
        method: "POST",    
        headers: new Headers({
            "content-type": "application/json",
        }),
        body: JSON.stringify({
            "E": objectArray,   
           
        })
      };

  
    try{
        const response = await fetch(`http://192.168.2.43/MessengerBackend/router.php/${linkstring}?${GetConnectorStr()}`, req);

        //console.log("RESPONSE: "+ JSON.stringify(response))

        if (!response.ok) {
            throw new Error(`API call failed with status ${response.status}`);
        }


        const data = await response.json();
        return data;
    } 
    catch (error) {
        console.log("API Error:", error);
        console.log("ERROR RESPONSE: "+response)
        throw error; // Re-throw the error for the caller to handle
    }
}