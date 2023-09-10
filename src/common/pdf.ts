import pdfkit from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function generatePDF(data: any) {
    const outputPath = path.join(__dirname, 'pdfs'); 
    const outputFilename = `invoice-${data.room_id}.pdf`;
    const outputFilePath = path.join(outputPath, outputFilename);

    
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    const doc = new pdfkit({ autoFirstPage: true });
    doc.pipe(fs.createWriteStream(outputFilePath));


    doc.fontSize(16);
    doc.font('Helvetica-Bold');
    

    doc.text('Booking Receipt', { align: 'center' });
    doc.moveDown(0.5); 

    
    doc.fontSize(12);
    doc.font('Helvetica');


    doc.text(`Hello, { align: 'center' }`);
    doc.moveDown(0.5); 
    doc.text('Thank you for booking a room at our Hotel. We are excited to welcome you and assure you of the best service during your stay.');

    doc.moveDown();
    doc.text(`Booking ID: ${data._id}`);
    doc.text(`Booking Date: ${data.bookedOn}`);
    doc.text(`Check-in Date: ${data.check_in_date}`);
    doc.text(`Check-out Date: ${data.check_out_date}`);

    doc.end();

    console.log('PDF invoice generated and saved:', outputFilePath);
    return [outputFilePath,outputFilename];
}
