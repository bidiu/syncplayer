/**
 * The last error handler.
 * Typically, 'Error' instance thrown in program will go here.
 */
module.exports = function(err, req, res, next) {
	// programing error, let express to handle that
	next(err);
};
