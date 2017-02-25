var validations = {

};

module.exports = {
    
    // Sends a response to a client. If there is an error, 400 status sent.
send: function(outputJson, res) {
    if (outputJson.error)
        console.error('Error: ' + outputJson.details);
    
    if (outputJson.error)
        res.status(400);
    else
        res.status(200);
    res.jsonp(outputJson);
},
    
    // Sends an empty successful response.
sendEmpty: function(res) {
    res.status(200);
    res.send(null);
},
    
    // Sends raw data in a success response.
sendRaw: function(data, res) {
    res.status(200);
    res.send(data);
},
    
sendImage: function(path, res) {
    if (fs.existsSync(path)) {
        res.writeHead(200, {'Content-Type': 'image/png'});
        fs.createReadStream(path).pipe(res);
    }
},
    
error: function(message, res, additionalParams) {
    var obj = {'error' : true, 'details' : message };
    if(additionalParams) {
        for (var key in additionalParams) { obj[key] = additionalParams[key]; }
    }
    this.send(obj, res);
},
    
success: function(additionalParams, res) {
    var obj = {'error' : false, 'details' : 'Success'};
    if(additionalParams) {
        for (var key in additionalParams) { obj[key] = additionalParams[key]; }
    }
    this.send(obj, res);
},
    
file: function(path, res) {
    
    this.sendFile(path);
},
    
invalidParams: function(params, res) {
    for(var key in params) {
        if(validations.hasOwnProperty(key)) {
            var validateError = validations[key](params[key]);
            if(validateError) {
                this.send({ 'error': true, 'details': validateError }, res);
                return true;
            }
        }
    }
    return false;
},
}
