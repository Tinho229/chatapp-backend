import express from "express" ;
import authRoutes from "./src/routes/authRoutes";
import conversationRoute from "./src/routes/conversationRoutes";
import messagesRoute from "./src/routes/messagesRoutes";

const app = express() ;

app.use(express.json());
app.use('/api/auth' , authRoutes) ;

app.use('/api/conversations' , conversationRoute) ;
app.use('/api/messages' , messagesRoute) ;
app.use(express.urlencoded({extended : true})) ;

export default app;