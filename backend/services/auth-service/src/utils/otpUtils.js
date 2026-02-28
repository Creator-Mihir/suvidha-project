/**
 * OTP Utility for SUVIDHA Auth Service
 *
 * For hackathon: USE_MOCK_OTP=true logs OTP to console
 * For production: integrate Twilio / MSG91 / Fast2SMS here
 */

const generateOTPCode = () => {
    // 6 digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  const getOTPExpiry = () => {
    const minutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10');
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + minutes);
    return expiry;
  };
  
  /**
   * Send OTP — mock for hackathon, real SMS in production
   */
  const sendOTP = async (mobile, otpCode) => {
    const useMock = process.env.USE_MOCK_OTP === 'true';
  
    if (useMock) {
      // For demo/testing — OTP is visible in server logs
      console.log(`\n📱 [OTP SERVICE - MOCK] Mobile: ${mobile} | OTP: ${otpCode}\n`);
      return { success: true, method: 'mock' };
    }
  
    // ── Production: Replace with your SMS provider ──
    // Example with Fast2SMS (popular in India):
    // const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    //   method: 'POST',
    //   headers: { authorization: process.env.FAST2SMS_API_KEY },
    //   body: JSON.stringify({
    //     route: 'otp',
    //     variables_values: otpCode,
    //     numbers: mobile,
    //   })
    // });
    // return response.json();
  
    throw new Error('SMS provider not configured. Set USE_MOCK_OTP=true for development.');
  };
  
  module.exports = { generateOTPCode, getOTPExpiry, sendOTP };