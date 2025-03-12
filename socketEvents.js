export default function socketEvents(io) {

    io.on("connection", (socket) => {

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log('Client disconnected')
        });
    });
};