const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();

const cors=require("cors");
const corsOptions ={
   origin:'*',
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

// Middleware
app.use(express.json());

// Routes
app.use('/api/members', require('./routes/member')); 
app.use('/api/services', require('./routes/service'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/appointments', require('./routes/appointment'));
app.use('/api/facilities', require('./routes/facility'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
