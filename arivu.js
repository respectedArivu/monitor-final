import express from 'express';
import https from 'https';
import nodemailer from 'nodemailer';

const app = express();
const port = process.env.PORT || 3000;

const websites = [
    "https://autan.co/es-co",
    "https://www.offdefense.com.co/es-co",
    "https://offuruguay.com.uy/es-uy",
    "https://linhaoff.com.br/pt-br",
    "https://off.com/es-us",
    "https://off.com.ph/en-ph",
    "https://autan.com.ro/ro-ro",
    "https://www.off.ca/en-ca",
    "https://off.com.ar/es-ar",
    "https://www.off.com.gt",
    "https://www.autandefense.de/de-de",
    "https://www.off.com.sv",
    "https://autan.fr/fr-fr",
    "https://ziploc.com.ph",
    "https://off.com.pl/pl-pl",
    "https://www.off.cr",
    "https://www.off.com.pa",
    "https://off.co.th/th-th",
    "https://off.hn/es",
    "https://www.off.com.pe",
    "https://autan.id/id-id",
    "https://ziploc.cl",
    "https://www.off.ca/fr-ca",
    "https://offmexico.com.mx/es-mx",
    "https://www.autandefense.gr/el-gr",
    "https://ziploc.ca/en",
    "https://autan.com.es/es-es",
    "https://www.off.hn",
    "https://autan.it/it-it",
    "https://off.co.th/en-th",
    "https://www.off.com.ec",
    "https://ziploc.com.br/",
    "https://www.autandefense.es",
    "https://ziploc.com.sg",
    "https://offcolombia.com.co/es-co",
    "https://off.com/en",
    "https://autan.de/de-de",
    "https://www.autandefense.fr/fr-fr",
    "https://ziploc.com.ar/es-AR",
    "https://autan.hr/hr-hr",
    "https://www.autan.gr/el-gr",
    "https://www.off.com.ni",
    "https://www.offaustralia.com.au",
    "https://ziploc.com.au",
    "https://ziploc.com/en",
    "https://ziploc.com.my",
    "https://ziploc.com/es-US",
    "https://ziplocmexico.com.mx",
    "https://www.autandefense.it/it-it",
    "https://ziploc.ca/fr-ca"
];

const emailConfig = {
    service: 'gmail',
    auth: {
        user: 'arivanandhan33@gmail.com', // Replace with your email
        pass: 'ynzu xvii qizj fozz' // Replace with your email password
    }
};

const recipientEmail = 't75480382@gmail.com'; // Replace with recipient email

async function sendEmail(subject, message) {
    try {
        const transporter = nodemailer.createTransport(emailConfig);
        await transporter.sendMail({
            from: emailConfig.auth.user,
            to: recipientEmail,
            subject: subject,
            text: message
        });
        console.log(`✅ Email sent to ${recipientEmail} with subject: "${subject}"`);
    } catch (error) {
        console.error("❌ Failed to send email:", error);
    }
}

async function checkWebsitesStatus(urls) {
    console.log('🔍 Checking website status...');

    const results = await Promise.all(
        urls.map(url => {
            return new Promise(resolve => {
                https.get(url, res => {
                    const status = res.statusCode === 200 ? 'Online' : 'Offline';
                    console.log(`${url} is ${status} (Status Code: ${res.statusCode})`);
                    resolve({ url, status, statusCode: res.statusCode });
                }).on('error', error => {
                    console.log(`${url} is Offline. Error: ${error.message}`);
                    resolve({ url, status: 'Offline', error: error.message });
                });
            });
        })
    );

    console.log('✅ Website status check completed.');

    const offlineSites = results.filter(site => site.status === 'Offline');
    if (offlineSites.length > 0) {
        const message = offlineSites.map(site => `${site.url} is Offline`).join('\n');
        console.log('🚨 Offline websites found! Sending email alert...');
        await sendEmail('⚠️ Website Down Alert', message);
    }
}

app.get('/', (req, res) => {
    res.send('🌐 Website Monitoring Service is running.');
});

app.get('/check-websites', async (req, res) => {
    console.log('📢 Manual check requested...');
    await checkWebsitesStatus(websites);
    res.send('✅ Website status check completed!');
});

// ✅ Prevents crashes & ensures continuous checking
setInterval(async () => {
    try {
        await checkWebsitesStatus(websites);
    } catch (error) {
        console.error("❌ Error in scheduled website check:", error);
    }
}, 60000); // Runs every 1 minute

app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
