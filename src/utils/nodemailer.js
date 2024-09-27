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

const sendEmailWhenForgetPassword = async (email, fullname) => {
  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: "QuanLyKhoHang <hangnguyenthithu32@gmai.com>",
      to: email,
      subject: `Xin chào ${fullname}. \n`,
      //thay đổi đường dẫn khi deploy
      text: `Bạn đã yêu cầu đổi mật khẩu. Vui lòng truy cập vào đường dẫn sau để đổi mật khẩu: http://localhost:5173/reset-password`,
    };

    const result = await transport.sendMail(mailOptions);

    return result;
  } catch (error) {
    return error;
  }
};


module.exports = {sendEmail, sendEmailWhenForgetPassword};