const nodemailer = require('nodemailer');
const sendEmail = async (email, fullname, otp) => {
  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: "QuanLyKhoHang <hangnguyenthithu32@gmai.com",
      to: email,
      subject: `Xin chào ${fullname}. \n`,
      text: `Mã OTP của bạn là: ${otp}. Đừng chia sẻ với bất kỳ ai!`,
    };

    const result = await transport.sendMail(mailOptions);

    return result;
  } catch (error) {
    return error;
  }
}

module.exports = {sendEmail};