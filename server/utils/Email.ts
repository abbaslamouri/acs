import sgMail from '@sendgrid/mail'
import colors from 'colors'

class Email {
  to: string
  firstname: string
  subject: string
  text: string
  html: string
  data: any
  constructor(data: any) {
    this.to = data.email
    this.firstname = data.name.split(' ')[0]
    this.subject = data.emailSubject
    this.text = data.emailText
    this.html = data.emailHtml
    this.data = data
  }

  async send(templateId: string) {
    console.log('SPREAD', { ...this.data, firstname: this.firstname })
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

    const msg: any = {
      to: {
        email: this.to,
        name: this.firstname,
      },
      from: {
        email: process.env.FROM_EMAIL,
        name: process.env.FROM_NAME,
      },
      replyTo: {
        email: process.env.FROM_EMAIL,
        name: process.env.FROM_NAME,
      },
      subject: this.subject,
      // template_id: templateId,
      // dynamic_template_data: { ...this.data, firstname: this.firstname, subject: this.subject },
      text: this.text,
      html: this.html,
    }

    await sgMail.send(msg)
    console.log(colors.green.bold('Message sent'))
  }

  async sendRegisterationEmail() {
    await this.send(process.env.SENDGRID_SIGNUP_TEMPLATE_ID as string)
  }

  async sendPasswordResetEmail() {
    await this.send(process.env.SENDGRID_PASSWORD_RESET_TEMPLATE_ID as string)
  }

  async sendOrderProcessing() {
    await this.send(process.env.SENDGRID_ORDER_TEMPLATE_ID as string)
  }
}

export default Email

// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//         const msg = {
//           to: {
//             email: order.shippingAddress.email,
//             name: order.shippingAddress.name,
//           },

//           from: {
//             email: 'support@yrlus.com',
//             name: 'YRL Consulting',
//           },
//           replyTo: {
//             email: 'support@yrlus.com',
//             name: 'Abbas Lamouri',
//           },
//           subject: 'Thank you for your order',
//           template_id: process.env.ORDER_TEMPLATE_ID,
//           dynamic_template_data: {
//             retailer: 'YRL Consulting',
//             items: order.items,
//           },
//         }

//         console.log('SEND', await sgMail.send(msg))
