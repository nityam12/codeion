//action for a controller
//as it is a object it must have a name -0home

module.exports.home = function(req, res) {
    return res.end('<h1>express is up for Codeial!</h1');
};