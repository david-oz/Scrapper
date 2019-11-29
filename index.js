const puppeteer = require('puppeteer-core');
const nodemailer = require('nodemailer');

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
    try {
        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        await page.goto(prog.url);
        let results = await page.$x(prog.xPath);
        if (results && results.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (ex) {
        console.log(ex);
        return null;
    } finally {
        await browser.close();
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
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
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
// run();
// sendMail('לעוף על המיליון');

const winston = require('winston');
let logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)(),
        new(winston.transports.File)({filename: './file'})
    ]
});

logger.log('info', 'data');