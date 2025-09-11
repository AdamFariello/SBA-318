//TODO: Figure out if this should be changed
//Stole from the teacher
function error(status, msg) {
    var err = new Error(msg);
    err.status = status;
    return err;
}
module.exports = error;