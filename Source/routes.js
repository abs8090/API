module.exports = function(router) {
    
    router.get('/', function(req, res) {
        io.send({'error' : false, 'status': 'Aziz API currently online' }, res);
    });

};
