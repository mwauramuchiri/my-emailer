# My eMailer Tool - HTML Email Design & Sending Platform

A comprehensive desktop Progressive Web App (PWA) for designing and sending beautiful HTML emails with advanced features and template management.

## Overall Description

My eMailer Tool is a full-stack application that combines a Vue.js frontend with a Node.js backend to provide a powerful email design and sending platform. The application integrates the BeeFree HTML email editor plugin to enable users to create professional email templates with drag-and-drop functionality, then send them to multiple recipients with advanced email configuration options.

The platform features a modern, responsive interface with real-time notifications, template management, and secure authentication. It supports both individual and bulk email sending with comprehensive email validation and drag-and-drop email management.

## Features

### 🎨 **Email Design & Templates**
- **BeeFree HTML Editor Integration**: Professional drag-and-drop email design tool
- **Template Management**: Save, load, and reuse email templates

### 📧 **Email Sending Capabilities**
- **Multiple Recipient Types**: Support for To, CC, and BCC recipients
- **Bulk Email Sending**: Send to multiple recipients simultaneously or individually
- **Email Validation**: Real-time validation of email addresses
- **Drag-and-Drop Email Management**: Intuitive email chip interface
- **SMTP Configuration**: Custom SMTP server support (Gmail addresses not allowed for security)

### 🔧 **Advanced Configuration**
- **Custom SMTP Settings**: Configure host, port, and authentication
- **Sender Information**: Customizable sender name and email address
- **Subject Line Management**: Dynamic subject line configuration
- **Security Features**: Password-protected access and JWT authentication

### 💻 **User Interface**
- **Progressive Web App**: Installable desktop application
- **Real-time Notifications**: Toast notifications for email status
- **Socket.io Integration**: Real-time email sending status updates
- **Modal Interface**: Clean, organized email configuration interface

### 🔒 **Security & Authentication**
- **Password Protection**: Secure access control
- **JWT Token Management**: Secure session handling
- **CORS Configuration**: Proper cross-origin request handling
- **Input Validation**: Comprehensive email and form validation

## Prerequisites

Before installing and running the project, ensure you have the following:

### System Requirements
- **Node.js**: Version 8.10.0 or higher
- **npm**: Latest version recommended
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge with JavaScript enabled

### Email Service Requirements
- **SMTP Server**: Access to an SMTP server (Gmail not supported for security reasons)
- **Email Credentials**: Valid email account with SMTP access
- **BeeFree API**: BeeFree plugin credentials (Client ID and Secret)

### Environment Variables
You'll need to configure the following environment variables:

```env
# App Configuration
VUE_APP_APP_PORT=3000
VUE_APP_APP_URL=http://localhost:3000
VUE_APP_APP_DEV_URL=http://localhost:8080

# Email Configuration
VUE_APP_EMAIL_DEFAULT_EMAIL=your-email@domain.com
VUE_APP_EMAIL_DEFAULT_PASSWORD=your-email-password
VUE_APP_EMAIL_DEFAULT_HOST=smtp.your-domain.com

# BeeFree Plugin Configuration
VUE_APP_BEEFREE_CLIENT_ID=your-beefree-client-id
VUE_APP_BEEFREE_CLIENT_SECRET=your-beefree-client-secret

# Your Preferred Password
USER_PASSWORD='****' # hidden from vue app
```

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd emailer-tool
```

### 2. Install Frontend Dependencies
```bash
cd app
npm install
```

### 3. Install Backend Dependencies
```bash
cd ../ci
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory with your configuration:

```env
# Copy the environment variables from the Prerequisites section
# and fill in your actual values
```

### 5. Start the Development Servers

#### Option A: Run Both Servers Separately

**Start the Backend Server:**
```bash
cd ci
npm run serve
```
The backend will start on port 3000 (or your configured port).

**Start the Frontend Development Server:**
```bash
cd app
npm run serve
```
The frontend will start on port 8080.

#### Option B: Production Build
```bash
cd app
npm run build
```
This creates a production build in the `app/dist` directory that the backend serves.

### 6. Access the Application
- **Development**: Navigate to `http://localhost:8080`
- **Production**: Navigate to `http://localhost:3000`

### 7. Authentication
- The application will prompt for a password on first access
- Enter the password configured in your backend authentication

## Project Structure

```
emailer-tool/
├── app/                    # Vue.js Frontend
│   ├── src/
│   │   ├── components/    # Vue components
│   │   ├── modules/       # Utility modules
│   │   ├── mixins/        # Vue mixins
│   │   └── store/         # Vuex store
│   └── public/            # Static assets
├── ci/                    # Node.js Backend
│   ├── src/               # Backend source files
│   ├── templates/         # Email templates storage
│   └── server.js          # Main server file
└── README.md
```

## Usage

1. **Select a Template**: Choose from available email templates or create a new one
2. **Design Your Email**: Use the BeeFree editor to design your email content
3. **Configure Email Settings**: Set up sender information, subject, and SMTP settings
4. **Add Recipients**: Enter email addresses for To, CC, and BCC fields
5. **Send Emails**: Click send to deliver your emails with real-time status updates

## Troubleshooting

### Common Issues

**Email Sending Fails:**
- Verify SMTP server credentials
- Ensure email server allows authentication
- Check firewall settings

**BeeFree Editor Not Loading:**
- Verify BeeFree API credentials
- Check internet connection
- Clear browser cache

**Authentication Issues:**
- Verify password configuration
- Check JWT token settings
- Restart the application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please refer to the project documentation or create an issue in the repository.