
// import amqp from 'amqplib';
// import { generatePDF } from './pdf';
// import { sendRecipient } from '../controller/mailController';

// const consumer = async () => {
//     const rabbitMQConnection = await amqp.connect('amqp://localhost');
//     const channel = await rabbitMQConnection.createChannel();

//     const queueName = 'booking-notifications';
//     channel.assertQueue(queueName);

//     channel.consume(queueName, async (message) => {
//         if(!message) return;
//         const content=JSON.parse(message.content.toString())
//         console.log(content)
//         const [filepath]= await generatePDF(content);
//         console.log(content.email);
//         await sendRecipient(content.email,filepath)
        
//         // fs.promises.unlink(filepath)
//         channel.ack(message); 
//     });
// };
// consumer();