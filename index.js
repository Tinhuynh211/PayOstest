const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const payOS = require("./utils/payos");
const QRCode = require("qrcode");

const app = express();
const PORT = process.env.PORT || 3030;
dotenv.config();

// Cấu hình CORS cho phép domain cụ thể
const corsOptions = {
  origin: ["https://exe-201-71jh.vercel.app"], // Cho phép domain frontend của bạn
  methods: ["GET", "POST"], // Cho phép các phương thức HTTP cụ thể
  allowedHeaders: ["Content-Type", "Authorization"], // Cho phép các tiêu đề cụ thể
  credentials: true, // Cho phép gửi cookie hoặc xác thực thông tin qua yêu cầu
};

app.use(cors(corsOptions)); // Áp dụng cấu hình CORS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Nhận thông tin và xử lý tạo mã QR
app.post("/create-payment-link", async (req, res) => {
  const { customerName, customerPhone, customerAddress, hours } = req.body;

  const orderCode = Math.floor(Math.random() * 1000000);
  const totalAmount = hours * 20000;

  const description = `Đặt chỗ ${hours} giờ với bảo mẫu`;
  const returnUrl = "https://your-website.com/success";
  const cancelUrl = "https://your-website.com/failed";

  try {
    // Tạo liên kết thanh toán qua cổng thanh toán
    const paymentLinkResponse = await payOS.createPaymentLink({
      orderCode,
      amount: totalAmount,
      description,
      returnUrl,
      cancelUrl,
      customer: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
      },
    });

    const paymentUrl = paymentLinkResponse.checkoutUrl;
    const qrCodeDataUrl = await QRCode.toDataURL(paymentUrl);

    res.status(200).json({
      success: true,
      paymentUrl,
      qrCodeDataUrl,
    });
  } catch (error) {
    console.error("Error creating payment link:", error);
    res.status(500).json({ error: "Không thể tạo liên kết thanh toán" });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
