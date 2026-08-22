import PDFDocument from 'pdfkit';
import { AIRPORTS } from '../data/airports.js';

/**
 * Generates a PDF boarding pass document buffer for a flight booking
 */
export function generateTicketPdfBuffer(bookingData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      const { flight = {}, passengers = [], pnr = 'SKY-8924', totalAmount = 0, currency = 'INR', paymentMethod = 'UPI' } = bookingData;

      // Extract exact Origin Code & City
      const originCode = (typeof flight.origin === 'object' ? flight.origin?.code : flight.origin) || 'DEL';
      const originAirportObj = AIRPORTS.find(a => a.code.toUpperCase() === originCode.toUpperCase());
      const originCity = (typeof flight.origin === 'object' ? flight.origin?.city : flight.originCity) || (originAirportObj ? originAirportObj.city : originCode);

      // Extract exact Destination Code & City
      const destCode = (typeof flight.destination === 'object' ? flight.destination?.code : flight.destination) || 'BOM';
      const destAirportObj = AIRPORTS.find(a => a.code.toUpperCase() === destCode.toUpperCase());
      const destCity = (typeof flight.destination === 'object' ? flight.destination?.city : flight.destCity) || (destAirportObj ? destAirportObj.city : destCode);

      // Primary Colors
      const brandCyan = '#06b6d4';
      const darkNavy = '#07090e';
      const cardBg = '#0f172a';
      const borderCyan = '#0284c7';
      const textLight = '#f8fafc';
      const textMuted = '#94a3b8';

      // Header Banner
      doc.rect(40, 40, 515, 70).fill(darkNavy);
      
      doc.fillColor(brandCyan).fontSize(20).font('Helvetica-Bold').text('SKYWARD GLOBAL', 60, 55);
      doc.fillColor(textMuted).fontSize(10).font('Helvetica').text('OFFICIAL ELECTRONIC TICKET & BOARDING PASS', 60, 80);

      doc.fillColor('#10b981').fontSize(14).font('Helvetica-Bold').text('CONFIRMED', 430, 55, { align: 'right' });
      doc.fillColor(textLight).fontSize(10).font('Helvetica-Bold').text(`PNR: ${pnr}`, 430, 75, { align: 'right' });

      // Divider Line
      doc.moveTo(40, 120).lineTo(555, 120).strokeColor(borderCyan).lineWidth(2).stroke();

      // Flight Route Summary Card
      doc.rect(40, 130, 515, 100).fill(cardBg).strokeColor('#1e293b').stroke();

      const airlineName = typeof flight.airline === 'object' ? (flight.airline?.name || 'Vistara') : (flight.airline || 'Vistara Airways');
      doc.fillColor(brandCyan).fontSize(12).font('Helvetica-Bold').text(airlineName, 60, 145);
      doc.fillColor(textMuted).fontSize(10).font('Helvetica').text(`Flight ${flight.flightNumber || 'UK-815'} | ${flight.aircraft || 'Airbus A320'}`, 60, 162);

      // Origin & Destination (Matching Search Fares 100%)
      doc.fillColor(textLight).fontSize(22).font('Helvetica-Bold').text(originCode.toUpperCase(), 60, 182);
      doc.fillColor(textMuted).fontSize(10).font('Helvetica').text(`${originCity} (${flight.depTime || '08:30'})`, 60, 208);

      doc.fillColor(brandCyan).fontSize(14).font('Helvetica-Bold').text('➔  ' + (flight.duration || '2h 15m') + '  ➔', 220, 188, { align: 'center' });

      doc.fillColor(textLight).fontSize(22).font('Helvetica-Bold').text(destCode.toUpperCase(), 430, 182, { align: 'right' });
      doc.fillColor(textMuted).fontSize(10).font('Helvetica').text(`${destCity} (${flight.arrTime || '10:45'})`, 430, 208, { align: 'right' });

      // Passenger Details Header
      doc.fillColor(brandCyan).fontSize(14).font('Helvetica-Bold').text('PASSENGER DETAILS', 40, 250);
      doc.moveTo(40, 268).lineTo(555, 268).strokeColor('#334155').lineWidth(1).stroke();

      let currentY = 280;

      passengers.forEach((p, idx) => {
        doc.rect(40, currentY, 515, 45).fill('#1e293b');

        doc.fillColor(textLight).fontSize(11).font('Helvetica-Bold').text(`${idx + 1}. ${p.firstName || 'Traveler'} ${p.lastName || ''}`, 55, currentY + 14);
        doc.fillColor(textMuted).fontSize(9).font('Helvetica').text(`Govt / Passport ID: ${p.passport || 'Verified'}`, 220, currentY + 15);
        doc.fillColor(brandCyan).fontSize(11).font('Helvetica-Bold').text(`SEAT ${p.seat || '11A'}`, 450, currentY + 14, { align: 'right' });

        currentY += 52;
      });

      // Fare & Payment Summary
      currentY += 15;
      doc.rect(40, currentY, 515, 65).fill(cardBg).strokeColor('#334155').stroke();

      doc.fillColor(textMuted).fontSize(10).font('Helvetica').text('Cabin Class:', 60, currentY + 15);
      doc.fillColor(textLight).fontSize(10).font('Helvetica-Bold').text(flight.cabinClass || 'Economy', 140, currentY + 15);

      doc.fillColor(textMuted).fontSize(10).font('Helvetica').text('Payment Method:', 60, currentY + 35);
      doc.fillColor(textLight).fontSize(10).font('Helvetica-Bold').text(paymentMethod.toUpperCase(), 140, currentY + 35);

      const symbol = currency === 'INR' ? 'Rs.' : currency === 'USD' ? '$' : currency === 'EUR' ? 'EUR' : 'GBP';
      doc.fillColor(textMuted).fontSize(10).font('Helvetica').text('Total Fare Paid:', 350, currentY + 25);
      doc.fillColor('#10b981').fontSize(16).font('Helvetica-Bold').text(`${symbol} ${totalAmount.toLocaleString('en-IN')}`, 430, currentY + 22, { align: 'right' });

      // Security Footer / Barcode Box
      currentY += 85;
      doc.rect(40, currentY, 515, 50).fill(darkNavy).strokeColor(brandCyan).stroke();
      doc.fillColor(brandCyan).fontSize(10).font('Helvetica-Bold').text('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||', 55, currentY + 12, { align: 'center' });
      doc.fillColor(textMuted).fontSize(8).font('Helvetica').text(`SECURE VERIFIED BOARDING PASS - BARCODE ${pnr}`, 55, currentY + 32, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
