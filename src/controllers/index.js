const path = require("path");
const fs = require("fs");
const { sendMail } = require("../lib/utils");

module.exports = {
  create: async (req, res) => {
    const requiredFields = ["name", "phoneNumber", "review", "rating"];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: `Error: Please fill the ${field} to proceed`,
          field,
        });
      }
    }

    const { name, phoneNumber, review, rating: ratingString } = req.body;

    const rating = parseInt(ratingString);

    if (isNaN(rating) || rating <= 0 || rating > 5) {
      return res.status(400).json({ message: `Error: Bad Request` });
    }

    if (rating >= 4) {
      return res.status(301).redirect(process.env.GOOGLE_REVIEW_REDIRECT_LINK);
    }

    // Save to database or send mail
    try {
      await sendMail(
        process.env.SEND_TO_EMAIL,
        `Easy Review: A ${rating} star review was submitted`,
        `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" lang="en"><head><meta content="width=device-width" name="viewport"/><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/><meta name="x-apple-disable-message-reformatting"/><meta content="IE=edge" http-equiv="X-UA-Compatible"/><meta name="x-apple-disable-message-reformatting"/><meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection"/><meta content="light" name="color-scheme"/><meta content="light" name="supported-color-schemes"/><!--$--><style>
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        mso-font-alt: 'sans-serif';
        src: url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2');
      }
  
      * {
        font-family: 'Inter', sans-serif;
      }
    </style><style>blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}@media only screen and (max-width:425px){.tab-row-full{width:100%!important}.tab-col-full{display:block!important;width:100%!important}.tab-pad{padding:0!important}}</style></head><body style="margin:0"><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:600px;min-width:300px;width:100%;margin-left:auto;margin-right:auto;padding:0.5rem"><tbody><tr style="width:100%"><td><p style="font-size:15px;line-height:24px;margin:16px 0;text-align:left;margin-bottom:20px;margin-top:0px;color:#374151;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">Dear Assent Team,<br/><br/>A review was submitted by ${name} using Easy Review. </p><h3 style="text-align:left;color:#111827;margin-bottom:12px;margin-top:0;font-size:24px;line-height:38px;font-weight:600">Review Details</h3><p style="font-size:15px;line-height:24px;margin:16px 0;text-align:left;margin-bottom:20px;margin-top:0px;color:#374151;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">Name: ${name}<br/>Phone number: ${phoneNumber}<br/>Rating: ${rating} star${
          rating > 1 ? "s" : ""
        }<br/>Review Message:<br/>${review}</p><p style="font-size:15px;line-height:24px;margin:16px 0;text-align:left;margin-bottom:20px;margin-top:0px;color:#374151;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">Regards,<br/>Easy Review.</p></td></tr></tbody></table><!--/$--></body></html>`
      );

      return res
        .status(200)
        .json({ message: "Thank you for your valuable feedback!" });
    } catch (error) {
      return res.status(500).json({
        message: "Error: Something went wrong while processing your request.",
      });
    }
  },
};
