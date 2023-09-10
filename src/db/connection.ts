
import mongoose from 'mongoose';

export const connectToDatabase=mongoose.connect('mongodb://localhost:27017/project_DB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));



