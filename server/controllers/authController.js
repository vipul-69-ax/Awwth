const AuthModel = require("../models/authModel");
const emailUtils = require("../utils/emailUtils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
async function signup(req, res) {
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    const user = await AuthModel.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
      emailVerified: false,
    });

    const verificationLink = emailUtils.generateVerificationLink(user._id);
    const mailData = {
      from: "sharmavipul01002@gmail.com",
      to: user.email,
      subject: "Email verification for FitFlow app.",
      html: `
        Hi ${user.name},
        To verify your email for <strong>FitFlow</strong>, click on the button below.
        <br/>
        Once you click the button, the email will be automatically verified.
        <br/>
        <a href=${verificationLink}>Verify my account</a>
      `,
    };

    emailUtils.sendMail(mailData, (err, info) => {
      if (err) {
        res.json({
          status: "ok",
          user: false,
          error: "Email not verified. Error sending email.",
        });
      } else {
        res.json({
          status: "ok",
          user: true,
          error: "Email not verified. Email sent.",
        });
      }
    });
  } catch (err) {
    res.json({ status: "error", user: false, error: err?.code });
  }
}

async function login(req, res) {
  try {
    const user = await AuthModel.findOne({
      email: req.body.email,
    });

    if (user) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isValidPassword) {
        res.json({
          status: "ok",
          user: false,
          error: "Incorrect password.",
        });
        return;
      } else if (!user.emailVerified) {
        const verificationLink = emailUtils.generateVerificationLink(user._id);
        const mailData = {
          from: "sharmavipul01002@gmail.com",
          to: user.email,
          subject: "Email verification for FitFlow app.",
          html: `
                Hi ${user.name},
                To verify your email for <strong>FitFlow</strong>, click on the button below.
                <br/>
                Once you click the button, the email will be automatically verified.
                <br/>
                <a href=${verificationLink}>Verify my account</a>
              `,
        };

        emailUtils.sendMail(mailData, (err, info) => {
          if (err) {
            res.json({
              status: "ok",
              user: false,
              error: "Email not verified. Error sending email.",
            });
          } else {
            res.json({
              status: "ok",
              user: false,
              error: "Email not verified. Email sent.",
            });
          }
        });
        return;
      } else {
        const token = jwt.sign(
          {
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
          },
          "GK^8#yf&2%9Aq3j!Pz*6nL@WsBdE$5tY"
        );
        res.json({ status: "ok", user: true, token: token });
      }
    } else {
      res.json({
        status: "ok",
        user: false,
        error: "No account found with this email.",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      error: "An unexpected error occured.",
      user: false,
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const user = await AuthModel.findOne({ email: req.body.email });
    if (user) {
      const t = emailUtils.encryptedStr();
      const tempPassword = await bcrypt.hash(t, 10);
      const update = await AuthModel.updateOne(
        { email: req.body.email },
        { password: tempPassword }
      );

      const verificationLink = `http://localhost:3001/auth/forgot-password?userEmail=${user.email}&tempPassword=${t}`;
      const mailData = {
        from: "sharmavipul01002@gmail.com",
        to: user.email,
        subject: "Password reset for FitFlow app.",
        html: `
        Hi ${user.name},
        To reset your password for <strong>FitFlow</strong>, click on the button below.
        <br/>
        Once you click the button, you will be redirected to a link.
        <br/>
        <a href=${verificationLink}>Reset my password</a>
      `,
      };

      emailUtils.sendMail(mailData, (err, info) => {
        if (err) {
          res.json({
            status: "error",
            user: false,
            error: "An unexpected error occurred",
          });
        } else {
          res.json({
            status: "ok",
            user: true,
            success: "Password recovery email sent. Password updated.",
          });
        }
      });
    } else {
      res.json({
        status: "error",
        user: false,
        error: "The user with the provided email does not exist.",
      });
    }
  } catch (err) {
    res.json({
      status: "error",
      user: false,
      error: "An unexpected error occurred.",
    });
  }
}

async function forgotPasswordGET(req, res) {
  try {
    res.send(
      `The temporary password for account with email address ${req.query.userEmail} has been set to ${req.query.tempPassword}. You're requested to change this password from settings of your account as soon as possible.`
    );
  } catch (e) {
    res.send(`Error updating password. Try again.`);
  }
}
async function verifyAccount(req, res) {
  try {
    const userId = req.query.userId;
    await AuthModel.updateOne({ _id: userId }, { emailVerified: true });
    res.send("Email verified.");
  } catch (err) {
    res.send("Email not verified.");
    console.log(err);
  }
}

module.exports = {
  signup,
  login,
  forgotPassword,
  forgotPasswordGET,
  verifyAccount,
};
