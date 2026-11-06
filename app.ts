import express from "express" ;
import authRoutes from "./src/routes/authRoutes";
import conversationRoute from "./src/routes/conversationRoutes";

const app = express() ;

app.use(express.json());
app.use('/api/auth' , authRoutes) ;
app.use('/api/conversations' , conversationRoute) ;
app.use(express.urlencoded({extended : true})) ;

export default app;