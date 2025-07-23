// popup.js - Enhanced College Form Autofiller Popup

class FormAutofiller {
  constructor() {
    this.formData = {};
    this.activeTab = 'personal';
    this.fieldList = [
      'usn', 'name', 'firstName', 'lastName', 'middleName', 'email', 'collegeEmail',
      'phone', 'gender', 'dob', 'tenth', 'twelfth', 'course', 'branch',
      'graduationPercent', 'postGraduationPercent', 'campus', 'backlogs', 
      'neopatScore', 'nativePlace', 'permanentAddress', 'placementStatus', 
      'bootcampAttendance', 'pwd'
    ];
    this.init();
  }

  init() {
    this.loadExistingData();
    this.setupEventListeners();
    this.updateStats();
    this.startPeriodicUpdates();
  }

  // Load existing data from Chrome storage
  async loadExistingData() {
    try {
      const result = await chrome.storage.sync.get(["formData"]);
      if (result.formData) {
        this.formData = result.formData;
        this.populateForm();
        this.updateStats();
        document.getElementById('stats').style.display = 'block';
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.showStatus('Failed to load saved data', 'error');
    }
  }

  // Populate form fields with saved data
  populateForm() {
    Object.entries(this.formData).forEach(([key, value]) => {
      const element = document.getElementById(key);
      if (element && value) {
        element.value = value;
        // Add visual feedback for filled fields
        element.classList.add('filled');
        element.style.borderColor = '#28a745';
      }
    });
  }

  // Setup all event listeners
  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Save button
    document.getElementById('save').addEventListener('click', () => {
      this.saveData();
    });

    // Autofill button
    document.getElementById('autofill').addEventListener('click', () => {
      this.autofillForm();
    });

    // Real-time validation and saving
    document.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('input', () => {
        this.validateField(input);
        this.autoSave();
      });

      input.addEventListener('blur', () => {
        this.validateField(input);
      });
    });

    // Auto-fill name fields when full name changes
    document.getElementById('name').addEventListener('input', (e) => {
      this.autoFillNameFields(e.target.value);
    });

    // Phone number formatting
    document.getElementById('phone').addEventListener('input', (e) => {
      this.formatPhoneNumber(e.target);
    });

    // Date formatting for DOB
    document.getElementById('dob').addEventListener('input', (e) => {
      this.formatDate(e.target);
    });
  }

  // Switch between tabs with smooth animation
  switchTab(tabName) {
    if (this.activeTab === tabName) return;

    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.form-section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    this.activeTab = tabName;

    // Trigger animation
    this.animateTabContent();
  }

  // Animate tab content
  animateTabContent() {
    const activeSection = document.querySelector('.form-section.active');
    activeSection.style.opacity = '0';
    activeSection.style.transform = 'translateX(20px)';

    setTimeout(() => {
      activeSection.style.opacity = '1';
      activeSection.style.transform = 'translateX(0)';
    }, 150);
  }

  // Validate individual field
  validateField(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove previous validation styles
    input.classList.remove('error', 'success');

    switch (input.id) {
      case 'email':
      case 'collegeEmail':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        const phoneRegex = /^\d{10}$/;
        if (value && !phoneRegex.test(value.replace(/\D/g, ''))) {
          isValid = false;
          errorMessage = 'Please enter a valid 10-digit phone number';
        }
        break;

      case 'usn':
        if (value && value.length < 8) {
          isValid = false;
          errorMessage = 'USN should be at least 8 characters';
        }
        break;

      case 'cgpa':
      case 'mcaCgpa':
        const cgpa = parseFloat(value);
        if (value && (cgpa < 0 || cgpa > 10)) {
          isValid = false;
          errorMessage = 'CGPA should be between 0 and 10';
        }
        break;

      case 'tenth':
      case 'twelfth':
        const percentage = parseFloat(value);
        if (value && (percentage < 0 || percentage > 100)) {
          isValid = false;
          errorMessage = 'Percentage should be between 0 and 100';
        }
        break;

      case 'dob':
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (value && !dateRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please use DD-MM-YYYY format';
        }
        break;
    }

    // Apply validation styles
    if (value) {
      input.classList.add(isValid ? 'success' : 'error');
      if (isValid) {
        input.style.borderColor = '#28a745';
      } else {
        input.style.borderColor = '#dc3545';
        this.showFieldError(input, errorMessage);
      }
    } else {
      input.style.borderColor = '#e9ecef';
    }

    return isValid;
  }

  // Show field-specific error
  showFieldError(input, message) {
    // Remove existing error messages
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }

    // Create new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

    input.parentNode.appendChild(errorDiv);

    // Remove error after 3 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 3000);
  }

  // Auto-fill name fields from full name
  autoFillNameFields(fullName) {
    if (!fullName.trim()) return;

    const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
    const firstNameField = document.getElementById('firstName');
    const middleNameField = document.getElementById('middleName');
    const lastNameField = document.getElementById('lastName');

    if (nameParts.length >= 1 && !firstNameField.value) {
      firstNameField.value = nameParts[0];
      firstNameField.style.borderColor = '#17a2b8';
    }

    if (nameParts.length === 2 && !lastNameField.value) {
      lastNameField.value = nameParts[1];
      lastNameField.style.borderColor = '#17a2b8';
      if (!middleNameField.value) {
        middleNameField.value = '.';
        middleNameField.style.borderColor = '#17a2b8';
      }
    }

    if (nameParts.length >= 3) {
      if (!middleNameField.value) {
        middleNameField.value = nameParts.slice(1, -1).join(' ');
        middleNameField.style.borderColor = '#17a2b8';
      }
      if (!lastNameField.value) {
        lastNameField.value = nameParts[nameParts.length - 1];
        lastNameField.style.borderColor = '#17a2b8';
      }
    }
  }

  // Format phone number
  formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    input.value = value;
    
    // Show warning if phone number is not 10 digits
    if (value.length > 0 && value.length < 10) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'field-error';
      errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 12px;
        margin-top: 4px;
        display: flex;
        align-items: center;
        gap: 4px;
      `;
      errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> Phone number must be 10 digits`;
      
      // Remove existing error message if any
      const existingError = input.parentNode.querySelector('.field-error');
      if (existingError) {
        existingError.remove();
      }
      
      input.parentNode.appendChild(errorDiv);
      input.style.borderColor = '#dc3545';
    } else if (value.length === 10) {
      // Remove error message if number is complete
      const existingError = input.parentNode.querySelector('.field-error');
      if (existingError) {
        existingError.remove();
      }
      input.style.borderColor = '#28a745';
    }
  }

  // Format date input
  formatDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '-' + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + '-' + value.slice(5, 9);
    }
    input.value = value;
  }

  // Auto-save data
  autoSave() {
    clearTimeout(this.autoSaveTimeout);
    this.autoSaveTimeout = setTimeout(() => {
      this.collectFormData();
      this.saveToStorage();
      this.updateStats();
    }, 1000);
  }

  // Collect form data
  collectFormData() {
    this.formData = {};
    this.fieldList.forEach(fieldId => {
      const element = document.getElementById(fieldId);
      if (element && element.value.trim()) {
        this.formData[fieldId] = element.value.trim();
      }
    });
  }

  // Save data to storage
  async saveToStorage() {
    try {
      await chrome.storage.sync.set({ formData: this.formData });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Save data manually
  async saveData() {
    const saveBtn = document.getElementById('save');
    const originalText = saveBtn.innerHTML;
    
    saveBtn.innerHTML = '<div class="loading"></div> Saving...';
    saveBtn.disabled = true;

    try {
      this.collectFormData();
      await this.saveToStorage();
      this.updateStats();
      this.showStatus('Data saved successfully!', 'success');
      
      // Visual feedback for saved fields
      Object.keys(this.formData).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
          element.style.borderColor = '#28a745';
          element.classList.add('filled');
        }
      });

    } catch (error) {
      console.error('Error saving data:', error);
      this.showStatus('Failed to save data. Please try again.', 'error');
    } finally {
      setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
      }, 1000);
    }
  }

  // Autofill current form
  async autofillForm() {
    const autofillBtn = document.getElementById('autofill');
    const originalText = autofillBtn.innerHTML;
    
    autofillBtn.innerHTML = '<div class="loading"></div> Filling Form...';
    autofillBtn.disabled = true;

    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Execute content script to fill the form
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: this.fillFormScript,
        args: [this.formData]
      });

      this.showStatus('Form filled successfully!', 'success');
      
      // Close popup after successful autofill
      setTimeout(() => {
        window.close();
      }, 1500);

    } catch (error) {
      console.error('Error during autofill:', error);
      this.showStatus('Failed to fill form. Make sure you\'re on a form page.', 'error');
    } finally {
      setTimeout(() => {
        autofillBtn.innerHTML = originalText;
        autofillBtn.disabled = false;
      }, 1000);
    }
  }

  // Content script function for filling forms
  fillFormScript(formData) {
    const fieldMappings = {
      // Common field mappings
      'usn': ['usn', 'student_id', 'registration_number', 'reg_no', 'usn no'],
      'name': ['name', 'full_name', 'student_name', 'fullname', 'full name'],
      'firstName': ['first_name', 'fname', 'firstname', 'first name'],
      'lastName': ['last_name', 'lname', 'lastname', 'surname', 'last name'],
      'middleName': ['middle_name', 'mname', 'middlename', 'middle name'],
      'email': ['email', 'email_id', 'personal_email', 'email id'],
      'collegeEmail': ['college_email', 'official_email', 'university_email', 'college mail id'],
      'phone': ['phone', 'mobile', 'contact', 'phone_number', 'mobile_number', 'mobile number'],
      'gender': ['gender', 'sex'],
      'dob': ['dob', 'date_of_birth', 'birth_date', 'date of birth'],
      'tenth': ['tenth', '10th', 'ssc', 'class_10', '10th %'],
      'twelfth': ['twelfth', '12th', 'hsc', 'class_12', 'puc', 'diploma', 'inter %', 'puc %', '12th %'],
      'course': ['course', 'degree', 'program', 'graduation'],
      'branch': ['branch', 'department', 'specialization', 'stream'],

      'graduationPercent': ['graduation %', 'graduation percent', 'ug %', 'be %', 'b.tech %', 'btech %'],
      'postGraduationPercent': ['post graduation %', 'pg %', 'mca %', 'm.tech %', 'mtech %', 'post graduation'],
      'campus': ['campus', 'college campus', 'institution', 'college name'],
      'backlogs': ['backlogs', 'arrears', 'pending_subjects', 'do you have backlogs'],
      'neopatScore': ['neopat', 'neopat_score', 'test_score', 'nect written test'],
      'nativePlace': ['native_place', 'hometown', 'birth_place'],
      'permanentAddress': ['address', 'permanent_address', 'home_address'],
      'placementStatus': ['placement', 'placement_status', 'job_status', 'are you placed'],
      'bootcampAttendance': ['bootcamp', 'training', 'workshop'],
      'pwd': ['pwd', 'disability', 'handicapped']
    };

    let filledCount = 0;

    Object.entries(formData).forEach(([key, value]) => {
      if (!value) return;

      const possibleNames = fieldMappings[key] || [key];
      let fieldFilled = false;

      for (const name of possibleNames) {
        if (fieldFilled) break;

        // Try different selectors
        const selectors = [
          `input[name="${name}"]`,
          `input[id="${name}"]`,
          `select[name="${name}"]`,
          `select[id="${name}"]`,
          `textarea[name="${name}"]`,
          `textarea[id="${name}"]`,
          `input[name*="${name}"]`,
          `input[id*="${name}"]`,
          `select[name*="${name}"]`,
          `select[id*="${name}"]`
        ];

        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector);
          
          elements.forEach(element => {
            if (fieldFilled) return;

            if (element.type === 'radio') {
              // Handle radio buttons
              const radioOption = document.querySelector(`input[name="${element.name}"][value="${value}"], input[name="${element.name}"][value*="${value}"]`);
              if (radioOption) {
                radioOption.checked = true;
                fieldFilled = true;
                filledCount++;
              }
            } else if (element.type === 'checkbox') {
              // Handle checkboxes
              if (value.toLowerCase() === 'yes' || value.toLowerCase() === 'true') {
                element.checked = true;
                fieldFilled = true;
                filledCount++;
              }
            } else if (element.tagName === 'SELECT') {
              // Handle select dropdowns
              const option = Array.from(element.options).find(opt => 
                opt.value === value || 
                opt.text.toLowerCase().includes(value.toLowerCase()) ||
                value.toLowerCase().includes(opt.text.toLowerCase())
              );
              if (option) {
                element.value = option.value;
                element.dispatchEvent(new Event('change', { bubbles: true }));
                fieldFilled = true;
                filledCount++;
              }
            } else {
              // Handle text inputs, textareas
              element.value = value;
              element.dispatchEvent(new Event('input', { bubbles: true }));
              element.dispatchEvent(new Event('change', { bubbles: true }));
              fieldFilled = true;
              filledCount++;
            }

            // Add visual feedback
            if (fieldFilled) {
              element.style.backgroundColor = '#e8f5e8';
              element.style.borderColor = '#28a745';
            }
          });
        }
      }
    });

    // Show result notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = `✓ Filled ${filledCount} fields successfully!`;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }

  // Update statistics
  updateStats() {
    const completedCount = Object.keys(this.formData).length;
    const totalFields = this.fieldList.length;
    
    document.getElementById('completed-count').textContent = `${completedCount}/${totalFields}`;
    document.getElementById('last-updated').textContent = new Date().toLocaleString();

    if (completedCount > 0) {
      document.getElementById('stats').style.display = 'block';
    }
  }

  // Show status message
  showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type} show`;

    setTimeout(() => {
      statusDiv.classList.remove('show');
    }, 3000);
  }

  // Start periodic updates
  startPeriodicUpdates() {
    setInterval(() => {
      this.updateStats();
    }, 30000); // Update every 30 seconds
  }
}

// Initialize the form autofiller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FormAutofiller();
});

// Handle extension messages
chrome.runtime?.onMessage?.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStats') {
    const autofiller = new FormAutofiller();
    autofiller.updateStats();
  }
});