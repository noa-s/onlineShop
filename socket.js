const socket =require('socket.io')();
socket.listen(3008);

module.exports = {
    userActions :() =>{
        // Well be emit only when the admin adds or update a product
        socket.emit('USER_ACTION');
        console.log('emitted');
    },
    adminActions :()=>{
        // Well be emit only when the admin adds or update a product
        socket.emit('ADMIN_ACTION');
        console.log('emitted');
    }
}
