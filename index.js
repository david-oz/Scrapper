const puppeteer = require('puppeteer-core');
const nodemailer = require('nodemailer');
const { transports, createLogger, format } = require('winston');

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: `${__dirname}/activity.log`, level: 'info' }),
    ]
});

const options = { executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" };
const keshetUrl = 'https://www.mako.co.il/tv-joinus';
const programs = [
    {
        url: 'https://13tv.co.il/general/programs/signup-auditions/',
        xPath: `//h3[contains(text(),'לעוף על המיליון')]`,
        name: 'לעוף על המיליון'
    }
]

let isNewProgramExist = async (prog) => {
    logger.info(`starting analysis for ${prog.name}`);
    let browser;
    try {
        browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        await page.goto(prog.url, { waitUntil: 'load', timeout: 0 });
        let results = await page.$x(prog.xPath);
        if (results && results.length > 0) {
            logger.info(`${prog.name} is available, sending mail...`);
            return true;
        } else {
            return false;
        }
    } catch (ex) {
        logger.info(ex.message);
    } finally {
        await browser.close();
        return null;
    }
};

let sendMail = async (progName) => {

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'networshwell@gmail.com',
            pass: 'netWorshWell908070'
        }
    });

    var mailOptions = {
        from: 'networshwell@gmail.com',
        to: 'kdavidoz@gmail.com',
        subject: 'עדכון הרשמה לתוכניות',
        text: `${progName}, ${new Date().toString()}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            logger.info(error);
        } else {
            logger.info('Email sent: ' + info.response)
        }
    });
};

let run = async () => {
    for (let prog of programs) {
        let res = await isNewProgramExist(prog);
        if (res) {
            sendMail(prog.name);
        }
    }
};
run();
// sendMail('לעוף על המיליון');



