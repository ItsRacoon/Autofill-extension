# College Form Autofiller - Chrome Extension

A Chrome extension designed to automatically fill college placement forms with saved user data. The extension intelligently matches form fields with stored information, making the process of filling multiple college application forms faster and more efficient.

## Features

- **Smart Field Detection**: Intelligent field matching with priority-based algorithms
- **Multiple Field Types**: Supports text inputs, radio buttons, dropdowns, and date fields
- **Data Persistence**: Saves data across browser sessions using Chrome Storage API
- **Real-time Validation**: Input validation with visual feedback
- **Google Forms Support**: Optimized for Google Forms with advanced field detection
- **User-friendly Interface**: Clean, modern popup interface with tabbed organization

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your browser toolbar

## Usage

### Setting Up Your Data
1. Click the extension icon in your browser toolbar
2. Fill in your information across the three tabs:
   - **Personal**: Name, email, phone, gender, date of birth
   - **Academic**: Grades, course, branch, graduation details
   - **Other**: Campus, placement status, additional information
3. Data is automatically saved as you type

### Auto-filling Forms
1. Navigate to a Google Form
2. Click the extension icon
3. Click the "Autofill Form" button
4. The extension will automatically detect and fill matching fields

## Supported Sites

- Google Forms (docs.google.com/forms/*)
- Forms.gle domains

## Field Mappings

The extension recognizes various field patterns including:
- **USN/Student ID**: USN, Roll Number, Registration Number
- **Names**: Full Name, First Name, Last Name, Middle Name
- **Contact**: Email, Phone, Mobile Number
- **Academic**: 10th %, 12th %, CGPA, Course, Branch
- **Other**: Gender, DOB, Campus, Placement Status

## Technical Details

- **Manifest Version**: 3
- **Permissions**: storage, activeTab, scripting
- **Browser Compatibility**: Chrome and Chromium-based browsers
- **Data Storage**: Chrome Storage Sync API for cross-device sync

## Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- Data syncs across your Chrome browsers when signed in

## Version History

- **v1.0.1**: Production release with enhanced field detection and error handling
- **v1.0.0**: Initial release

## Support

For issues or feature requests, please check the browser console for error messages and ensure you're on a supported Google Forms page.