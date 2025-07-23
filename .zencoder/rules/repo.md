---
description: Repository Information Overview
alwaysApply: true
---

# College Form Autofiller Information

## Summary
A Chrome extension designed to automatically fill college placement forms with saved user data. The extension intelligently matches form fields with stored information, making the process of filling multiple college application forms faster and more efficient.

## Structure
- **manifest.json**: Chrome extension configuration file (Manifest V3)
- **popup.html**: User interface for data entry and management
- **popup.js**: JavaScript for popup functionality and data management
- **content.js**: Content script that runs on matching web pages to fill forms
- **.zencoder**: Configuration directory

## Language & Runtime
**Language**: JavaScript
**Version**: ES6+
**Browser API**: Chrome Extension API
**Manifest Version**: 3

## Dependencies
**External Libraries**:
- Font Awesome 6.0.0 (CDN)

## Features & Functionality
**Field Mapping**:
- Intelligent field detection with priority-based matching
- Support for personal, academic, and other information categories
- Fuzzy matching with Levenshtein distance algorithm
- Support for graduation and post-graduation percentages
- Campus selection (DSEC, DSATM, DSU)
- Branch/Department selection with predefined engineering branches
- NEOPAT Score Level selection with predefined levels

**Data Management**:
- Chrome Storage Sync API for cross-device data persistence
- Real-time validation and auto-saving
- Structured data organization with field categories

**Form Filling**:
- Automatic detection of form fields on Google Forms
- Support for text inputs, radio buttons, and select fields
- Event simulation for compatibility with modern web frameworks

## Usage
**Data Entry**:
- Users enter their information in the popup interface
- Data is organized in tabs (Personal, Academic, Other)
- Information is automatically saved to Chrome storage

**Form Filling**:
```
1. Navigate to a Google Form
2. Click the extension icon
3. Click "Autofill Form" button
```

## Permissions
**Chrome Permissions**:
- storage: For saving user data
- activeTab: For accessing the current tab
- scripting: For executing scripts on the page

**Host Permissions**:
- https://docs.google.com/*
- https://forms.gle/*

## Target Platforms
**Supported Sites**:
- Google Forms (docs.google.com/forms/*)
- Forms.gle domains

**Browser Compatibility**:
- Chrome and Chromium-based browsers supporting Manifest V3