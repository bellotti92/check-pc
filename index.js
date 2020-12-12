const axios = require("axios");
const cheerio = require("cheerio");
const mail = require("nodemailer");
/* const cron = require("node-cron"); */
const url =
  "https://www.pichau.com.br/computadores/pichau-moba/computador-pichau-gamer-odin-ii-ryzen-5-3350g-16gb-2x8-ddr4-ssd-256gb-500w-cooler-sage-komor-rgb";

const getStatus = async () => {
  console.log("* Iniciando Pesquisa *");

  let data = await getData();

  if (data !== "Produto indisponível") {
    console.log("Produto em estoque. Enviando e-mail...");
    sendMail();
  } else {
    process.exit();
  }
};

const getData = async () => {
  try {
    let response = await axios(url);
    let title = "";
    const html = response.data;
    const $ = cheerio.load(html);
    const div = $(".stock");
    div.each(function () {
      title = $(this).find("span").text();
    });
    return title;
  } catch (error) {
    return error;
  }
};

const sendMail = async () => {
  const remetente = mail.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secureConnection: true,
    auth: {
      user: "bellotti.gui@outlook.com",
      pass: "Bellotti!@",
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  let info = await remetente.sendMail({
    from: "bellotti.gui@outlook.com", // sender address
    to: "bellotti.gui@outlook.com", // list of receivers
    subject: "Produto em estoque! ✔", // Subject line
    text: "Guilherme, o PC está disponível. CORRE!", // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  process.exit();
};

/* cron.schedule("20 * * * *", () => { */
getStatus();
/* }); */
