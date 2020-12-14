const axios = require("axios");
const cheerio = require("cheerio");
const mail = require("nodemailer");
const cron = require("node-cron");
const url =
  "https://www.pichau.com.br/hardware/memorias/memoria-team-group-t-force-rtb-delta-rgb-8gb-1x8-ddr4-3000mhz-tf12d48g3000hc16c01";

const getStatus = async () => {
  console.log("* Script iniciado *");

  console.log("* Iniciando Pesquisa *");

  let data = await getData();

  console.log("* Pesquisa finalizada, aguardando resultado *");

  if (data !== "Produto indisponível") {
    console.log("* Produto em estoque! *");
    console.log("* Preparando email de aviso! *");
    sendMail();
  } else {
    console.log("* Produto indisponível *");
    console.log("* Encerrando aplicação *");
    /* process.exit(); */
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

  console.log("* E-mail enviado: %s", info.messageId);
  console.log("* Encerrando aplicação *");
  /* process.exit(); */
};

cron.schedule("*/2 * * * *", () => {
  getStatus();
});
