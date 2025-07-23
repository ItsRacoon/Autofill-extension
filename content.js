// content.js - Enhanced College Form Autofiller - Robust Version
console.log("📥 College Form Autofiller script loaded - Enhanced Version");

// More precise field mappings with specificity priority
const fieldMappings = {
  // USN - highest priority for unique identifiers
  'usn': {
    patterns: ['USN', 'usn', 'University Seat Number', 'Student ID', 'Roll Number', 'Registration Number', 'USN No'],
    priority: 10,
    exactMatch: true
  },
  
  // Name fields - ordered by specificity to avoid conflicts
  'firstName': {
    patterns: ['FIRST_NAME', 'First Name', 'First name', 'fname', 'Given Name'],
    priority: 9,
    exactMatch: false
  },
  'middleName': {
    patterns: ['MIDDLE_NAME', 'Middle Name', 'Middle name', 'mname'],
    priority: 9,
    exactMatch: false
  },
  'lastName': {
    patterns: ['LAST_NAME', 'Last Name', 'Last name', 'lname', 'Surname', 'Family Name'],
    priority: 9,
    exactMatch: false
  },
  'fullName': {
    patterns: [
      'FULL NAME', 'Full Name', 'Student Name', 'Complete Name',
      'Student Full Name', 'Your Name', 'Enter Name', 'Enter Full Name'
    ],
    priority: 9,
    exactMatch: false
  },
  
  // Email fields - differentiated clearly
  'personalEmail': {
    patterns: [
      'EMAIL_ID ( Ensure no typo mistakes)  only gmail. No college mail ids',
      'E mail ID', 'EMAIL_ID', 'Email ID', 'Email', 'email', 'E-mail', 
      'Gmail ID', 'Personal Email', 'Gmail', 'Mail ID', 'Email Address', 
      'Personal Mail', 'only gmail', 'Ensure no typo mistakes'
    ],
    priority: 8,
    exactMatch: false,
    keywords: ['gmail', 'personal', 'only gmail', 'no college']
  },
  'collegeEmail': {
    patterns: [
      'College mail id', 'College Email', 'Institutional Email', 'College Email ID',
      'University Email', 'Official Email', 'Academic Email'
    ],
    priority: 8,
    exactMatch: false,
    keywords: ['college', 'institutional', 'university', 'official', 'academic']
  },
  
  // Contact and personal info
  'phone': {
    patterns: [
      'Mobile Number', 'MOBILE_NO', 'Mobile No', 'Phone Number', 'Contact Number',
      'Mobile Number (Only 10 Digit)', 'only 10 digits', '10 digits', 'Cell Number',
      'Phone', 'Mobile', 'Contact No'
    ],
    priority: 7,
    exactMatch: false
  },
  'gender': {
    patterns: ['Gender', 'GENDER', 'Sex', 'Male/Female', 'M/F'],
    priority: 8,
    exactMatch: true
  },
  'dob': {
    patterns: [
      'Enter the date of birth', 'DOB', 'Date of Birth', 'Birth Date', 'Date',
      'Enter the date of birth (DD-MM-YYYY)', 'Date of Birth (DD-MM-YYYY)', 'DOB (DD-MM-YYYY)'
    ],
    priority: 8,
    exactMatch: false
  },
  
  // Academic details
  'tenth': {
    patterns: [
      '10%', '10th %', 'SSLC %', 'Class 10 %', 'Tenth Percentage',
      '10th Percentage', 'SSC %', 'Matriculation %'
    ],
    priority: 7,
    exactMatch: false
  },
  'twelfth': {
    patterns: [
      '12th / Diploma %', '12th/Diploma %', '12th %', 'PUC %', 'Class 12 %', 
      'HSC %', 'Diploma %', 'Higher Secondary %', 'Intermediate %',
      '12th Percentage', 'PU %', 'Inter % or PUC %'
    ],
    priority: 7,
    exactMatch: false
  },
  'graduationPercent': {
    patterns: [
      'Graduation %', 'Graduation Percentage', 'UG %', 'BE %', 'B.Tech %', 
      'BTech %', 'Degree %', 'Graduation Marks', 'UG Percentage', 'BE/B.TECH CGPA',
      'CGPA', 'GPA', 'Current CGPA', 'Overall CGPA', 'Aggregate CGPA'
    ],
    priority: 8,
    exactMatch: false
  },
  'postGraduationPercent': {
    patterns: [
      'Post Graduation %', 'PG %', 'MCA %', 'M.Tech %', 'MTech %', 
      'Masters %', 'Post Graduation Percentage', 'PG Percentage',
      'Post Graduation % ( For MCA, M.Tech Students)', 'Post Graduation % ( For MCA, M.Tech Students) [mention Marks other write NA]'
    ],
    priority: 8,
    exactMatch: false
  },
  'campus': {
    patterns: [
      'Campus', 'College Campus', 'Institution', 'College Name', 
      'University Campus', 'Study Center', 'Branch Campus'
    ],
    priority: 8,
    exactMatch: false
  },
  'course': {
    patterns: ['Course', 'Program', 'Degree', 'Course Type', 'Graduation'],
    priority: 6,
    exactMatch: false
  },
  'branch': {
    patterns: [
      'UG BRANCH', 'Branch', 'Department', 'Specialization', 'Stream',
      'Engineering Branch', 'Subject', 'Major', 'Field of Study',
      'UG Branch', 'Undergraduate Branch'
    ],
    priority: 7,
    exactMatch: false
  },

  
  // Status fields
  'backlogs': {
    patterns: [
      'Do you have any current backlogs', 'Current Backlogs', 'Backlogs', 
      'Any Backlogs', 'current backlogs', 'Do you have Backlogs'
    ],
    priority: 8,
    exactMatch: false
  },
  'placementStatus': {
    patterns: [
      'Are you placed', 'Placement Status', 'Job Status', 'placed',
      'Mention the company name and CTC', 'Are you placed, if yes'
    ],
    priority: 8,
    exactMatch: false
  },
  'neopatScore': {
    patterns: [
      'NEOPAT SCORE LEVEL', 'NEOPAT Score', 'Aptitude Score', 'NEOPAT LEVEL',
      'Neo Pat Score', 'Neopat Level', 'NECT written test'
    ],
    priority: 8,
    exactMatch: false
  },
  'jobInterest': {
    patterns: [
      'Are you seriously interested', 'Job interest', 'Ready to join',
      'Interested in job role', 'Job readiness', 'Immediate joining'
    ],
    priority: 7,
    exactMatch: false
  }
};

let savedFormData = {};

// Load saved data
chrome.storage.sync.get(["formData"], ({ formData }) => {
  if (formData) {
    savedFormData = formData;
    console.log("📋 Loaded form data:", savedFormData);
  }
});

// Enhanced field matching with priority and context awareness
function findMatchingFieldKey(questionText) {
  const normalizedQuestion = questionText.toLowerCase().trim();
  const cleanQuestion = normalizedQuestion.replace(/[*()[\]]/g, '').replace(/\s+/g, ' ').trim();
  
  let bestMatch = null;
  let highestScore = 0;
  
  // Sort by priority (highest first)
  const sortedKeys = Object.keys(fieldMappings).sort((a, b) => {
    return (fieldMappings[b].priority || 0) - (fieldMappings[a].priority || 0);
  });
  
  for (const key of sortedKeys) {
    const config = fieldMappings[key];
    let matchScore = 0;
    
    for (const pattern of config.patterns) {
      const cleanPattern = pattern.toLowerCase().replace(/[*()[\]]/g, '').replace(/\s+/g, ' ').trim();
      
      // Exact match gets highest score
      if (cleanQuestion === cleanPattern) {
        matchScore = 100 + config.priority;
        break;
      }
      
      // Contains match
      if (cleanQuestion.includes(cleanPattern) || cleanPattern.includes(cleanQuestion)) {
        matchScore = Math.max(matchScore, 80 + config.priority);
      }
      
      // Keyword matching for email fields
      if (config.keywords && key.includes('Email')) {
        const keywordScore = calculateKeywordScore(cleanQuestion, config.keywords);
        matchScore = Math.max(matchScore, keywordScore + config.priority);
      }
      
      // Word-based matching
      const wordScore = calculateWordMatchScore(cleanQuestion, cleanPattern);
      if (wordScore > 0) {
        matchScore = Math.max(matchScore, wordScore + config.priority);
      }
    }
    
    if (matchScore > highestScore) {
      highestScore = matchScore;
      bestMatch = key;
    }
  }
  
  console.log(`🔍 Question: "${questionText}" -> Match: ${bestMatch} (Score: ${highestScore})`);
  return bestMatch;
}

// Calculate keyword matching score for email differentiation
function calculateKeywordScore(question, keywords) {
  let score = 0;
  for (const keyword of keywords) {
    if (question.includes(keyword.toLowerCase())) {
      score += 20;
    }
  }
  return score;
}

// Enhanced word matching with better scoring
function calculateWordMatchScore(question, pattern) {
  const questionWords = question.split(' ').filter(word => word.length > 2);
  const patternWords = pattern.split(' ').filter(word => word.length > 2);
  
  if (patternWords.length === 0) return 0;
  
  let matchedWords = 0;
  for (const pWord of patternWords) {
    for (const qWord of questionWords) {
      if (qWord.includes(pWord) || pWord.includes(qWord) || 
          levenshteinDistance(qWord, pWord) <= 2) {
        matchedWords++;
        break;
      }
    }
  }
  
  const matchRatio = matchedWords / patternWords.length;
  return matchRatio >= 0.6 ? Math.floor(matchRatio * 60) : 0;
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(str1, str2) {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}

// Robust input field filling
function fillInputField(input, value) {
  if (!input || !value) return false;
  
  try {
    // Clear existing value
    input.focus();
    input.select();
    document.execCommand('delete');
    input.value = '';
    
    // Process value based on input type
    const inputType = (input.type || 'text').toLowerCase();
    let processedValue = value.toString().trim();
    
    if (inputType === 'number') {
      processedValue = parseFloat(processedValue) || processedValue;
    } else if (inputType === 'date' && processedValue.includes('/')) {
      // Convert DD/MM/YYYY or DD-MM-YYYY to YYYY-MM-DD
      const parts = processedValue.split(/[/-]/);
      if (parts.length === 3 && parts[0].length <= 2) {
        processedValue = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    
    // Set value using multiple approaches
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, processedValue);
    }
    
    input.value = processedValue;
    
    // Trigger comprehensive events
    const events = [
      'input', 'change', 'keyup', 'keydown', 'blur', 'focus'
    ];
    
    events.forEach(eventType => {
      const event = new Event(eventType, { bubbles: true, cancelable: true });
      input.dispatchEvent(event);
    });
    
    // Additional React/modern framework events
    const inputEvent = new InputEvent('input', { 
      bubbles: true, 
      cancelable: true, 
      data: processedValue 
    });
    input.dispatchEvent(inputEvent);
    
    // Verify the value was set
    setTimeout(() => {
      if (input.value !== processedValue) {
        console.log(`⚠️ Value verification failed, retrying...`);
        input.value = processedValue;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 100);
    
    return true;
  } catch (error) {
    console.error('❌ Error filling input field:', error);
    return false;
  }
}

// Enhanced radio button handling with better matching
function fillRadioField(container, value, fieldKey) {
  if (!container || !value) return false;
  
  const valueToMatch = value.toString().toLowerCase().trim();
  
  try {
    const radios = container.querySelectorAll('[role="radio"], input[type="radio"]');
    
    for (const radio of radios) {
      const radioContainer = radio.closest('label, [role="radiogroup"] > div, .freebirdFormviewerViewItemsRadioChoice');
      const labelText = radioContainer ? radioContainer.textContent.toLowerCase().trim() : '';
      const radioValue = (radio.value || '').toLowerCase();
      
      // Enhanced matching logic based on field type
      let isMatch = false;
      
      if (fieldKey === 'gender') {
        isMatch = (valueToMatch === 'male' && labelText.includes('male')) ||
                  (valueToMatch === 'female' && labelText.includes('female')) ||
                  (valueToMatch === 'm' && labelText === 'male') ||
                  (valueToMatch === 'f' && labelText === 'female');
      } else if (fieldKey === 'backlogs' || fieldKey === 'placementStatus') {
        isMatch = (valueToMatch === 'no' && (labelText.includes('no') || labelText === 'no')) ||
                  (valueToMatch === 'yes' && (labelText.includes('yes') || labelText === 'yes'));
      } else {
        isMatch = labelText === valueToMatch ||
                  radioValue === valueToMatch ||
                  labelText.includes(valueToMatch) ||
                  valueToMatch.includes(labelText);
      }
      
      if (isMatch) {
        radio.click();
        
        // Double-check selection after a delay
        setTimeout(() => {
          if (!radio.checked && radio.getAttribute('aria-checked') !== 'true') {
            console.log(`🔄 Retrying radio selection for: ${fieldKey}`);
            radio.click();
          }
        }, 200);
        
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error filling radio field:', error);
    return false;
  }
}

// Robust data processing with proper name handling
function getProcessedValue(key, originalValue, questionText = '') {
  const value = originalValue.toString().trim();
  
  switch (key) {
    case 'firstName':
      // Extract first name only
      return value.split(' ')[0] || value;
      
    case 'middleName':
      // Handle middle name extraction properly
      const parts = value.split(' ');
      if (parts.length === 2) {
        return '.'; // No middle name, use dot
      } else if (parts.length > 2) {
        return parts.slice(1, -1).join(' '); // Everything between first and last
      }
      return '.'; // Default for no middle name
      
    case 'lastName':
      // Extract last name properly
      const nameParts = value.split(' ');
      if (nameParts.length > 1) {
        return nameParts[nameParts.length - 1]; // Last part
      }
      return ''; // No last name if only one word
      
    case 'fullName':
      return value; // Use complete name as-is
      
    case 'personalEmail':
      // Always use Gmail for personal email fields
      return savedFormData.email || value;
      
    case 'collegeEmail':
      // Use college email specifically
      return savedFormData.collegeEmail || savedFormData.collegeId || value;
      
    case 'backlogs':
      return savedFormData.backlogs || 'No';
      
    case 'placementStatus':
      return savedFormData.placementStatus || 'No';
      
    case 'gender':
      // Normalize gender values
      const genderLower = value.toLowerCase();
      if (genderLower.includes('male') && !genderLower.includes('female')) {
        return 'Male';
      } else if (genderLower.includes('female')) {
        return 'Female';
      }
      return value;
      
    default:
      return value;
  }
}

// Main enhanced autofill function
function fillGoogleForm() {
  console.log("🔄 Starting enhanced autofill process...");
  
  if (Object.keys(savedFormData).length === 0) {
    console.log("❌ No saved data found");
    showNotification("❌ No saved data found. Please set up your data first.", '#f44336');
    return;
  }
  
  let filledCount = 0;
  const processedQuestions = new Set();
  const failedFields = [];
  
  // Find all question containers
  const questionContainers = document.querySelectorAll(
    '[role="listitem"], .freebirdFormviewerViewItemsItemItem, .freebirdFormviewerComponentsQuestionBaseRoot'
  );
  
  console.log(`📊 Found ${questionContainers.length} question containers`);
  
  questionContainers.forEach((container, index) => {
    setTimeout(() => {
      try {
        const questionElement = container.querySelector(
          '[role="heading"], .freebirdFormviewerViewItemsItemItemTitle, .freebirdFormviewerComponentsQuestionBaseTitle'
        );
        
        const questionText = questionElement ? questionElement.textContent.trim() : '';
        
        if (!questionText || processedQuestions.has(questionText)) {
          return;
        }
        
        processedQuestions.add(questionText);
        console.log(`📝 Processing question ${index + 1}: "${questionText}"`);
        
        const matchedKey = findMatchingFieldKey(questionText);
        
        if (!matchedKey) {
          console.log(`⚠️ No match found for: "${questionText}"`);
          return;
        }
        
        const rawValue = savedFormData[matchedKey] || savedFormData[matchedKey.replace('personal', '').replace('Email', 'email')];
        
        if (!rawValue) {
          console.log(`⚠️ No data found for key: ${matchedKey}`);
          failedFields.push({ question: questionText, key: matchedKey, reason: 'No data' });
          return;
        }
        
        const value = getProcessedValue(matchedKey, rawValue, questionText);
        console.log(`✅ Processing: ${matchedKey} = "${value}" for question: "${questionText}"`);
        
        let filled = false;
        
        // Try filling based on field type priority
        
        // 1. Text inputs (highest priority)
        const textInputs = container.querySelectorAll(
          'input[type="text"], input[type="email"], input[type="tel"], input[type="number"], textarea, input:not([type])'
        );
        
        for (const input of textInputs) {
          if (!input.disabled && !input.readOnly) {
            if (fillInputField(input, value)) {
              filled = true;
              filledCount++;
              console.log(`✅ Successfully filled text input: ${matchedKey} = "${value}"`);
              break;
            }
          }
        }
        
        // 2. Date inputs
        if (!filled && matchedKey === 'dob') {
          const dateInputs = container.querySelectorAll('input[type="date"]');
          for (const input of dateInputs) {
            if (fillInputField(input, value)) {
              filled = true;
              filledCount++;
              console.log(`✅ Successfully filled date input: ${matchedKey} = "${value}"`);
              break;
            }
          }
        }
        
        // 3. Radio buttons
        if (!filled && fillRadioField(container, value, matchedKey)) {
          filled = true;
          filledCount++;
          console.log(`✅ Successfully filled radio: ${matchedKey} = "${value}"`);
        }
        
        if (!filled) {
          console.log(`❌ Failed to fill: ${matchedKey} for question: "${questionText}"`);
          failedFields.push({ question: questionText, key: matchedKey, reason: 'Fill failed' });
        }
        
      } catch (error) {
        console.error(`❌ Error processing question ${index + 1}:`, error);
        failedFields.push({ question: questionText || 'Unknown', key: 'unknown', reason: error.message });
      }
    }, 300 * index); // Increased delay to avoid conflicts
  });
  
  // Final status report
  setTimeout(() => {
    console.log(`🎉 Autofill completed! Successfully filled ${filledCount} fields.`);
    
    if (failedFields.length > 0) {
      console.log("⚠️ Failed fields:", failedFields);
      showNotification(`✅ Filled ${filledCount} fields. ${failedFields.length} fields need manual attention.`, '#FF9800');
    } else {
      showNotification(`✅ Perfect! Auto-filled all ${filledCount} fields successfully!`, '#4CAF50');
    }
  }, 5000);
}

// Enhanced notification system
function showNotification(message, color = '#4CAF50') {
  // Remove existing notifications
  const existing = document.querySelectorAll('.autofill-notification');
  existing.forEach(n => n.remove());
  
  const notification = document.createElement('div');
  notification.className = 'autofill-notification';
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 10000;
    background: ${color}; color: white; padding: 16px 24px;
    border-radius: 12px; font-size: 16px; font-weight: 600;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    max-width: 400px; word-wrap: break-word;
    font-family: 'Segoe UI', system-ui, sans-serif;
    line-height: 1.4;
    transform: translateX(420px);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Slide in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Slide out and remove
  setTimeout(() => {
    notification.style.transform = 'translateX(420px)';
    setTimeout(() => notification.remove(), 300);
  }, 6000);
}

// Message listener
window.addEventListener('message', (event) => {
  if (event.data.type === 'AUTOFILL_FORM') {
    chrome.storage.sync.get(["formData"], ({ formData }) => {
      if (formData) {
        savedFormData = formData;
        setTimeout(fillGoogleForm, 1000);
      } else {
        showNotification("❌ No form data found. Please configure your details first.", '#f44336');
      }
    });
  }
});

// Storage change listener
chrome.storage.onChanged.addListener((changes) => {
  if (changes.formData) {
    savedFormData = changes.formData.newValue || {};
    console.log("📋 Form data updated:", savedFormData);
  }
});

// Initialize
function init() {
  console.log("🚀 Initializing Enhanced College Form Autofiller...");
  
  // Only auto-fill if we have data and we're on a Google Form
  if (window.location.hostname.includes('docs.google.com')) {
    setTimeout(() => {
      if (savedFormData && Object.keys(savedFormData).length > 0) {
        fillGoogleForm();
      }
    }, 2000);
  }
}

// Wait for page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

console.log("✨ Enhanced College Form Autofiller loaded successfully!");