// ---- REMS middleware -----

// TODO use spec for variables instead of hardcoding into the file at build
var dacUrl = "${REMS_URL}"
var dacResource = "/api/entitlements"


var remsMiddleware = new TykJS.TykMiddleware.NewMiddleware({});

var remsMiddlewareUtil = {    
    
    call_dac: function (request, session, spec, authNToken) {
        log("--- Calling DAC (REMS) ---")

        var remsData = undefined;

        if (request.Headers["X-CanDIG-Authz"] === undefined) {

            var authorization_header = 'Bearer ' + authNToken;
            if (authorization_header == undefined) 
                throw new Error("Missing Authorization Header!");
            
            var splits = authorization_header.split(" ");
            //log(splits[0])
            if (splits[0] != "Bearer")
                throw new Error("Missing Bearer token!");

            var token = splits[1];
            var tokenPayload = token.split(".")[1];
            var decodedPayload = JSON.parse(b64dec(tokenPayload));
            
            /* 
            var data = {
                "jwt": token,
            };
            var requestParams = {
                "Method": "POST",
                "Domain": dacUrl, //spec.config_data.VAULT_SERVICE_URL,
                "Resource": dacResource, //spec.config_data.VAULT_SERVICE_RESOURCE,
                //"Body": JSON.stringify(data)
            };
            
            var resp = TykMakeHttpRequest(JSON.stringify(requestParams));
            var respJson = JSON.parse(resp);
            log("REMS Response: " + JSON.stringify(respJson))
            
            if (respJson.Code == 200) {
                remsData = {data : "this is a test"};
                return remsData;
            }    
            */

            // Simulated REMS fetch -- unknown URL at the moment..
            // ...
            remsData = {data : "this is a test"};
            return remsData;
        }
    }
};

remsMiddleware.NewProcessRequest(function(request, session, spec) {
   
    log("Running REMS JSVM middleware");

    if (request.Headers["Authorization"] != undefined) {

        // Expecting an Authorization header to have been passed down the gateway pipe
        var authNToken = request.Headers["Authorization"][0].split(" ")[1];

        // Fetch data from the DAC (REMS at the time of writing)
        var rems_data = remsMiddlewareUtil.call_dac(request, session, spec, authNToken);
        if(rems_data != undefined) {
            // Forward request off to backend with dac token
            request.SetHeaders['X-CANDIG-DAC-REMS'] = 'Bearer ' + JSON.stringify(rems_data); //.data.token;
            //request.ReturnOverrides.ResponseHeaders = {
            //    "X-CANDIG-DAC-REMS": 'Bearer ' + JSON.stringify(rems_data)
            //}
        } else {
            request.ReturnOverrides.ResponseCode = 403
            request.ReturnOverrides.ResponseError = "REMS Error"
        }
    }
    
    // MUST return both the request and session
    return remsMiddleware.ReturnData(request, session.meta_data);
});
    
log("REMS middleware initialised");
