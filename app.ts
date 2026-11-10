import express from "express" ;
import {Server} from "socket.io" ;
import http from "http" ;
import authRoutes from "./src/routes/authRoutes";
import conversationRoute from "./src/routes/conversationRoutes";
import messagesRoute from "./src/routes/messagesRoutes";
import { saveMessage } from "./src/controllers/messagesController";
import contactsRoute from "./src/routes/contactsRoutes";

const app = express() ;
app.use(express.json());
app.use(express.urlencoded({extended : true})) ;

const server = http.createServer(app) ;
const io =  new Server(server , {
    cors : { origin : '*'}
}) ;

app.use('/api/auth' , authRoutes) ;
app.use('/api/conversations' , conversationRoute) ;
app.use('/api/messages' , messagesRoute) 
app.use('/api/contacts' , contactsRoute) ;

io.on('connection' , (socket) => {
    console.log("A user connected" , socket.id);

    socket.on('joinConversation' , (conversationId) => {
        socket.join(conversationId) ;
        console.log("User Joined Conversations :"+conversationId);
        
    }) ;

    socket.on('sendMessage' , async (message) => {
        const {conversationId , senderId , content} = message ;
        socket.join(conversationId) ;
        console.log("User send  message :"+conversationId);

        try {
            const savedMessage = await saveMessage(conversationId , senderId  , content) ;
            console.log("Send Message :");
            console.log(savedMessage);
            io.to(conversationId).emit('newMessage' , savedMessage);

            io.emit('conversationUpdated' , {
                conversationId, lastMessage : savedMessage.content, lastMessageTime : savedMessage.created_at
            }); 
            
        } catch (err) {
            console.error('Failed to save message:' , err);
        }
        
    }) ;

    socket.on('disconnect' , () => {
        console.log('User disconnected:' , socket.id);
        
    }) ;
    
}) ;




export default server;