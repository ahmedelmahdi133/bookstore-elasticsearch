import sgMail from '../config/sendgrid.js';

class EmailService {
  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@bookstore.com';
    this.companyName = 'BookStore';
  }

  // Send welcome email to new users
  async sendWelcomeEmail(userEmail, username) {
    const msg = {
      to: userEmail,
      from: this.fromEmail,
      subject: `Welcome to ${this.companyName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333;">Welcome to ${this.companyName}!</h1>
          </div>
          
          <div style="padding: 20px;">
            <h2>Hello ${username}!</h2>
            <p>Thank you for joining our bookstore community. We're excited to have you on board!</p>
            
            <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>What's next?</h3>
              <ul>
                <li>🔍 Browse our extensive collection of books</li>
                <li>📚 Add your favorite books to your cart</li>
                <li>🚚 Enjoy fast and secure delivery</li>
                <li>⭐ Leave reviews and discover new reads</li>
              </ul>
            </div>
            
            <p>If you have any questions, feel free to contact our support team.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Start Shopping
              </a>
            </div>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px;">
            <p>&copy; 2024 ${this.companyName}. All rights reserved.</p>
          </div>
        </div>
      `,
      text: `
Welcome to ${this.companyName}, ${username}!

Thank you for joining our bookstore community. We're excited to have you on board!

What's next?
- Browse our extensive collection of books
- Add your favorite books to your cart
- Enjoy fast and secure delivery
- Leave reviews and discover new reads

If you have any questions, feel free to contact our support team.

Visit us at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}

© 2024 ${this.companyName}. All rights reserved.
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`Welcome email sent to ${userEmail}`);
      return { success: true, message: 'Welcome email sent successfully' };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send order confirmation email
  async sendOrderConfirmationEmail(userEmail, username, orderDetails) {
    const { orderNumber, items, totalAmount, shippingAddress } = orderDetails;
    
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.author}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      </tr>
    `).join('');

    const itemsText = items.map(item => 
      `${item.title} by ${item.author} - Qty: ${item.quantity} - $${item.price.toFixed(2)}`
    ).join('\n');

    const msg = {
      to: userEmail,
      from: this.fromEmail,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
            <h1>Order Confirmed! 🎉</h1>
            <p style="margin: 0; font-size: 18px;">Order #${orderNumber}</p>
          </div>
          
          <div style="padding: 20px;">
            <h2>Hello ${username}!</h2>
            <p>Thank you for your order! We've received your purchase and are preparing it for shipment.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Order Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #e9ecef;">
                    <th style="padding: 10px; text-align: left;">Book</th>
                    <th style="padding: 10px; text-align: left;">Author</th>
                    <th style="padding: 10px; text-align: center;">Qty</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr style="background-color: #f8f9fa; font-weight: bold;">
                    <td colspan="3" style="padding: 10px; text-align: right;">Total:</td>
                    <td style="padding: 10px; text-align: right;">$${totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            ${shippingAddress ? `
            <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Shipping Address</h3>
              <p style="margin: 5px 0;">${shippingAddress.fullName}</p>
              <p style="margin: 5px 0;">${shippingAddress.address}</p>
              <p style="margin: 5px 0;">${shippingAddress.city}, ${shippingAddress.postalCode}</p>
              <p style="margin: 5px 0;">${shippingAddress.country}</p>
            </div>
            ` : ''}
            
            <p>We'll send you another email with tracking information once your order ships.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Track Your Order
              </a>
            </div>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px;">
            <p>&copy; 2024 ${this.companyName}. All rights reserved.</p>
          </div>
        </div>
      `,
      text: `
Order Confirmed! 
Order #${orderNumber}

Hello ${username}!

Thank you for your order! We've received your purchase and are preparing it for shipment.

Order Details:
${itemsText}

Total: $${totalAmount.toFixed(2)}

${shippingAddress ? `
Shipping Address:
${shippingAddress.fullName}
${shippingAddress.address}
${shippingAddress.city}, ${shippingAddress.postalCode}
${shippingAddress.country}
` : ''}

We'll send you another email with tracking information once your order ships.

Track your order at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders

© 2024 ${this.companyName}. All rights reserved.
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`Order confirmation email sent to ${userEmail} for order ${orderNumber}`);
      return { success: true, message: 'Order confirmation email sent successfully' };
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(userEmail, username, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const msg = {
      to: userEmail,
      from: this.fromEmail,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center;">
            <h1>Password Reset Request</h1>
          </div>
          
          <div style="padding: 20px;">
            <h2>Hello ${username}!</h2>
            <p>We received a request to reset your password for your ${this.companyName} account.</p>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>⚠️ Important:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            
            <p>To reset your password, click the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
            
            <p><strong>This link will expire in 1 hour.</strong></p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px;">
            <p>&copy; 2024 ${this.companyName}. All rights reserved.</p>
          </div>
        </div>
      `,
      text: `
Password Reset Request

Hello ${username}!

We received a request to reset your password for your ${this.companyName} account.

⚠️ Important: If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

To reset your password, visit this link:
${resetUrl}

This link will expire in 1 hour.

© 2024 ${this.companyName}. All rights reserved.
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`Password reset email sent to ${userEmail}`);
      return { success: true, message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send order status update email
  async sendOrderStatusEmail(userEmail, username, orderDetails, newStatus) {
    const { orderNumber } = orderDetails;
    const statusMessages = {
      'paid': 'Your payment has been confirmed!',
      'processing': 'Your order is being processed.',
      'shipped': 'Your order has been shipped!',
      'delivered': 'Your order has been delivered!',
      'cancelled': 'Your order has been cancelled.'
    };

    const statusColors = {
      'paid': '#28a745',
      'processing': '#ffc107',
      'shipped': '#17a2b8',
      'delivered': '#28a745',
      'cancelled': '#dc3545'
    };

    const msg = {
      to: userEmail,
      from: this.fromEmail,
      subject: `Order Update - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: ${statusColors[newStatus] || '#007bff'}; color: white; padding: 20px; text-align: center;">
            <h1>Order Update</h1>
            <p style="margin: 0; font-size: 18px;">Order #${orderNumber}</p>
          </div>
          
          <div style="padding: 20px;">
            <h2>Hello ${username}!</h2>
            <p>${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <h3>Current Status</h3>
              <span style="background-color: ${statusColors[newStatus] || '#007bff'}; color: white; padding: 8px 16px; border-radius: 20px; text-transform: uppercase; font-weight: bold;">
                ${newStatus}
              </span>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Order Details
              </a>
            </div>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px;">
            <p>&copy; 2024 ${this.companyName}. All rights reserved.</p>
          </div>
        </div>
      `,
      text: `
Order Update
Order #${orderNumber}

Hello ${username}!

${statusMessages[newStatus] || 'Your order status has been updated.'}

Current Status: ${newStatus.toUpperCase()}

View your order details at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders

© 2024 ${this.companyName}. All rights reserved.
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`Order status email sent to ${userEmail} for order ${orderNumber}`);
      return { success: true, message: 'Order status email sent successfully' };
    } catch (error) {
      console.error('Error sending order status email:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();

