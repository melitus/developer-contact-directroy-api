module.exports = {
  email: {
    host: "mlsrvr.vinove.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      developer: 'asmelitus@mail.vinove.com',
      pass: 'melitus@123'
    }
  },
  JWT_SECRET: '224b9da9083e1a2080cf1bfd34a37c44',
  EMAIL_SOLT: 'fab710ed9e72c7358e6a52b471845fa8',
  PASS_SOLT: '4062a4e163e4d2cedc42559214d10433',
  PRIVATEKEY_SOLT: "e74d7c0de21e72aaffc8f2eef2bdb7c1",
  MAIL_FROM: "pankaj.yadav@mail.vinove.com",
  SMTP_SERVER: "mlsrvr.vinove.com",
  SMTP_PORT: 587,
  MAIL_AUTH: {
    user: 'asmlitus@mail.vinove.com',
    pass: 'password@123'
  },
  SOLT_ROUND: 10,
  ROLES: ["ADMIN", "DEVELOPER", "SUPER_ADMIN"]
};

