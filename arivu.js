import express from 'express';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';

const app = express();
const port = process.env.PORT || 3000;

const websites = [
    // Your website list here
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
    const transporter = nodemailer.createTransport(emailConfig);
    await transporter.sendMail({
        from: emailConfig.auth.user,
        to: recipientEmail,
        subject: subject,
        text: message
    });
    console.log(`Email sent to ${recipientEmail} with subject: "${subject}"`);
}

async function checkWebsitesStatus(urls) {
    console.log('Starting website status check...');
    const results = await Promise.all(urls.map(async (url) => {
        try {
            const response = await fetch(url, { method: 'GET' });
            const status = response.ok ? 'Online' : 'Offline';
            console.log(`${url} is ${status} (Status Code: ${response.status})`);
            return { url, status, statusCode: response.status };
        } catch (error) {
            console.log(`${url} is Offline. Error: ${error.message}`);
            return { url, status: 'Offline', error: error.message };
        }
    }));

    console.log('Website status check completed. Results:', results);
    
    const offlineSites = results.filter(site => site.status === 'Offline');
    if (offlineSites.length > 0) {
        const message = offlineSites.map(site => `${site.url} is Offline`).join('\n');
        console.log('Offline websites found. Sending email alert...');
        await sendEmail('Website Down Alert', message);
    }
}

app.get('/', (req, res) => {
    res.send('Welcome to the Website Monitoring Service');
});

app.get('/check-websites', async (req, res) => {
    console.log('Manual check requested...');
    await checkWebsitesStatus(websites);
    res.send('Website status check completed!');
});

// Start the background process of checking websites every minute
setInterval(() => checkWebsitesStatus(websites), 60000); // Check every 1 minute

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
