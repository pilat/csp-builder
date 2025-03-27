import { cspDirectives } from './cspDirectives.js';
import { Templates } from './templates.js';
import { Utils } from './utils.js';

/**
 * Manages CSP directives and their interactions
 */
export class DirectiveManager {
    /**
     * Creates a new DirectiveManager
     * @param {HTMLElement} container - The container element for directives
     * @param {HTMLElement} outputElement - The output textarea element
     */
    constructor(container, outputElement) {
        this.container = container;
        this.outputElement = outputElement;
        this.directives = [];
        
        // Remove any existing output section header
        const existingHeader = outputElement.previousElementSibling;
        if (existingHeader && existingHeader.tagName.toLowerCase() === 'h3') {
            existingHeader.remove();
        }
        
        this.initializeAllDirectives();
    }
    
    /**
     * Initializes all CSP directives
     */
    initializeAllDirectives() {
        // First add default-src
        const defaultSrcDirective = cspDirectives.find(d => d.name === 'default-src');
        if (defaultSrcDirective) {
            this.addDirective(defaultSrcDirective);
        }
        
        // Then add all other directives
        cspDirectives.forEach(directive => {
            if (directive.name !== 'default-src') {
                this.addDirective(directive);
            }
        });
    }
    
    /**
     * Adds a directive to the UI
     * @param {Object} directive - The directive to add
     * @returns {Object} The created directive object
     */
    addDirective(directive) {
        const directiveId = Utils.generateId();
        
        // Create section element
        const section = document.createElement('div');
        section.className = 'section';
        section.innerHTML = Templates.directiveSection(directiveId, directive);
        
        // Add to container
        this.container.appendChild(section);
        
        const directiveObj = {
            id: directiveId,
            name: directive.name,
            values: [],
            element: section
        };
        
        this.directives.push(directiveObj);
        this.setupDirectiveEventListeners(directiveObj);

        if (directive.type !== 'boolean') {
            this.updateSpecialValues(directiveObj);
        }
        
        return directiveObj;
    }
    
    /**
     * Sets up event listeners for a directive
     * @param {Object} directiveObj - The directive object
     */
    setupDirectiveEventListeners(directiveObj) {
        const directive = cspDirectives.find(d => d.name === directiveObj.name);
        
        if (directive.type === 'boolean') {
            this.setupBooleanDirectiveEventListeners(directiveObj);
        } else {
            this.setupListDirectiveEventListeners(directiveObj);
        }
    }
    
    /**
     * Sets up event listeners for boolean directives
     * @param {Object} directiveObj - The directive object
     */
    setupBooleanDirectiveEventListeners(directiveObj) {
        const disabledDiv = document.getElementById(`${directiveObj.id}-disabled`);
        const enabledDiv = document.getElementById(`${directiveObj.id}-enabled`);
        
        const updateSelection = (isEnabled) => {
            disabledDiv.classList.toggle('selected', !isEnabled);
            enabledDiv.classList.toggle('selected', isEnabled);
        };

        disabledDiv.addEventListener('click', () => {
            directiveObj.values = [];
            updateSelection(false);
            this.updateDirectiveValues(directiveObj);
            this.updateOutput();
        });

        enabledDiv.addEventListener('click', () => {
            directiveObj.values = ['enabled'];
            updateSelection(true);
            this.updateDirectiveValues(directiveObj);
            this.updateOutput();
        });

        // Initial state
        updateSelection(directiveObj.values.includes('enabled'));
    }

    /**
     * Sets up event listeners for list directives
     * @param {Object} directiveObj - The directive object
     */
    setupListDirectiveEventListeners(directiveObj) {
        const input = document.getElementById(`${directiveObj.id}-input`);
        const addBtn = document.getElementById(`${directiveObj.id}-add`);
        
        // Initially disable the button
        addBtn.disabled = true;
        
        const addValue = () => {
            if (input.value.trim()) {
                this.addValue(directiveObj, input.value.trim());
                input.value = '';
                addBtn.disabled = true;
            }
        };
        
        // Handle input changes
        input.addEventListener('input', () => {
            addBtn.disabled = !input.value.trim();
        });
        
        addBtn.addEventListener('click', addValue);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addValue();
            }
        });
    }
    
    /**
     * Clears all directive values
     */
    clear() {
        // Instead of clearing everything, just clear the values
        this.directives.forEach(directive => {
            directive.values = [];
            this.updateDirectiveValues(directive);
        });
        this.updateOutput();
    }
    
    /**
     * Adds a value to a directive
     * @param {Object} directive - The directive object
     * @param {string} value - The value to add
     */
    addValue(directive, value) {
        if (!directive.values.includes(value)) {
            directive.values.push(value);
            directive.values = this.sortDirectiveValues(directive.values);
            this.updateDirectiveValues(directive);
            this.updateOutput();
        }
    }
    
    /**
     * Removes a value from a directive
     * @param {Object} directive - The directive object
     * @param {string} value - The value to remove
     */
    removeValue(directive, value) {
        directive.values = directive.values.filter(v => v !== value);
        this.updateDirectiveValues(directive);
        this.updateOutput();
    }
    
    /**
     * Updates the UI for a directive's values
     * @param {Object} directive - The directive object
     */
    updateDirectiveValues(directive) {
        const statusElement = document.getElementById(`${directive.id}-status`);
        const directiveInfo = cspDirectives.find(d => d.name === directive.name);

        if (directiveInfo.type === 'boolean') {
            // Update boolean directive UI
            const disabledDiv = document.getElementById(`${directive.id}-disabled`);
            const enabledDiv = document.getElementById(`${directive.id}-enabled`);
            const isEnabled = directive.values.includes('enabled');
            
            if (disabledDiv && enabledDiv) {
                disabledDiv.classList.toggle('selected', !isEnabled);
                enabledDiv.classList.toggle('selected', isEnabled);
            }

            // Update status emoji
            statusElement.textContent = isEnabled ? '✅' : '🔲';
            return;
        }

        // Handle list directive (existing code)
        const valuesContainer = document.getElementById(`${directive.id}-values`);
        valuesContainer.innerHTML = '';
        
        // Sort values before displaying
        directive.values = this.sortDirectiveValues(directive.values);
        
        // Get default-src values
        const defaultSrc = this.directives.find(d => d.name === 'default-src');
        const defaultValues = defaultSrc ? defaultSrc.values : [];
        
        // List of directives that can inherit from default-src
        const inheritingDirectives = [
            'script-src', 'style-src', 'img-src', 'connect-src', 
            'font-src', 'object-src', 'media-src', 'frame-src', 
            'worker-src', 'manifest-src'
        ];
        
        // Determine status emoji
        let statusEmoji = '🔲';  // Default empty state
        
        if (directive.values.length > 0) {
            statusEmoji = '✅';  // Has own values
        } else if (directive.name !== 'default-src' && 
                  inheritingDirectives.includes(directive.name) && 
                  defaultValues.length > 0) {
            statusEmoji = '🔄';  // Inherits from default-src
        }
        
        statusElement.textContent = statusEmoji;
        
        // Display values
        directive.values.forEach(value => {
            const valueTag = document.createElement('div');
            valueTag.className = 'value-tag';
            valueTag.innerHTML = Templates.valueTag(value);
            valuesContainer.appendChild(valueTag);
        });
        
        // Add remove event listeners
        valuesContainer.querySelectorAll('.remove-value').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeValue(directive, btn.getAttribute('data-value'));
            });
        });
    }
    
    /**
     * Sorts directive values alphabetically
     * @param {Array} values - The values to sort
     * @returns {Array} Sorted values
     */
    sortDirectiveValues(values) {
        return [...values].sort((a, b) => a.localeCompare(b));
    }
    
    /**
     * Updates the special values section for a directive
     * @param {Object} directiveObj - The directive object
     */
    updateSpecialValues(directiveObj) {
        const specialContainer = document.getElementById(`${directiveObj.id}-special`);
        const prefixesContainer = document.getElementById(`${directiveObj.id}-prefixes`);
        
        specialContainer.innerHTML = '';
        if (prefixesContainer) {
            prefixesContainer.innerHTML = '';
        }
        
        const directive = cspDirectives.find(d => d.name === directiveObj.name);
        
        // Add common values
        if (directive?.common?.length > 0) {
            directive.common.forEach(item => {
                const specialValue = document.createElement('div');
                specialValue.className = 'special-value';
                specialValue.textContent = item.value;
                
                const tooltip = document.createElement('span');
                tooltip.className = 'tooltip';
                tooltip.textContent = item.description;
                specialValue.appendChild(tooltip);
                
                specialValue.addEventListener('click', () => {
                    this.addValue(directiveObj, item.value);
                });
                specialContainer.appendChild(specialValue);
            });
        }
        
        // Add prefixes if they exist
        if (directive?.prefixes?.length > 0 && prefixesContainer) {
            directive.prefixes.forEach(item => {
                const prefixValue = document.createElement('div');
                prefixValue.className = 'special-value prefix-value';
                prefixValue.textContent = item.prefix;
                
                const tooltip = document.createElement('span');
                tooltip.className = 'tooltip';
                tooltip.textContent = item.description;
                prefixValue.appendChild(tooltip);
                
                prefixValue.addEventListener('click', () => {
                    const input = document.getElementById(`${directiveObj.id}-input`);
                    input.value = item.prefix;
                    input.focus();
                    
                    // If the prefix ends with a quote, position cursor inside the quotes
                    if (item.prefix.endsWith("'")) {
                        const cursorPosition = item.prefix.length - 1;
                        input.setSelectionRange(cursorPosition, cursorPosition);
                    }
                });
                prefixesContainer.appendChild(prefixValue);
            });
        }
    }
    
    /**
     * Updates the output textarea with the current CSP header
     */
    updateOutput() {
        const cspParts = this.directives.map(directive => {
            const directiveInfo = cspDirectives.find(d => d.name === directive.name);
            
            if (directiveInfo.type === 'boolean') {
                return directive.values.includes('enabled') ? directive.name : '';
            }
            
            return directive.values.length > 0 ? `${directive.name} ${directive.values.join(' ')}` : '';
        }).filter(Boolean);
        
        this.outputElement.value = cspParts.join('; ');
        
        // Update copy button visibility
        const copyButton = document.querySelector('.copy-button');
        if (copyButton) {
            copyButton.classList.toggle('visible', this.outputElement.value.length > 0);
        }
        
        this.updateExplanation();
    }

    /**
     * Generates an explanation of the current CSP
     * @returns {string} The explanation text
     */
    generateExplanation() {
        const defaultSrc = this.directives.find(d => d.name === 'default-src');
        const defaultValues = defaultSrc?.values || [];
        const explanation = [];

        // Process directives (skipping default-src explanation)
        this.directives.forEach(directive => {
            if (directive.name === 'upgrade-insecure-requests') {
                if (directive.values.length > 0) {
                    explanation.push(`🔒 <a href="#upgrade-insecure-requests" class="directive-link">HTTP requests</a> will be automatically upgraded to HTTPS`);
                } else {
                    explanation.push(`🔓 <a href="#upgrade-insecure-requests" class="directive-link">HTTP requests</a> will not be automatically upgraded to HTTPS`);
                }
            } else if (directive.name === 'block-all-mixed-content') {
                if (directive.values.length > 0) {
                    explanation.push(`🛡️ <a href="#block-all-mixed-content" class="directive-link">Mixed content</a> (HTTP content on HTTPS pages) will be blocked`);
                } else {
                    explanation.push(`⚠️ <a href="#block-all-mixed-content" class="directive-link">Mixed content</a> (HTTP content on HTTPS pages) will not be explicitly blocked`);
                }
            } else if (directive.name !== 'default-src') {
                const linkText = this.getLinkText(directive.name);
                const desc = this.explainDirectiveValues(directive.name, directive.values.length > 0 ? directive.values : defaultValues);
                
                // If directive has its own values
                if (directive.values.length > 0) {
                    // For 'none' value, format differently
                    if (directive.values.includes("'none'")) {
                        explanation.push(`${this.getDirectiveEmoji(directive.name)} <a href="#${directive.name}" class="directive-link">${this.getDirectiveName(directive.name)}</a> ${desc}`);
                    } else {
                        explanation.push(`${this.getDirectiveEmoji(directive.name)} Can load <a href="#${directive.name}" class="directive-link">${linkText}</a> ${desc.substring(desc.indexOf(' ', desc.indexOf(' ') + 1))}`);
                    }
                } 
                // If directive can inherit and default-src has values
                else if (['script-src', 'style-src', 'img-src', 'connect-src', 'font-src', 
                         'object-src', 'media-src', 'frame-src', 'worker-src', 'manifest-src']
                         .includes(directive.name) && defaultValues.length > 0) {
                    explanation.push(`${this.getDirectiveEmoji(directive.name)} Can load <a href="#${directive.name}" class="directive-link">${linkText}</a> ${desc.substring(desc.indexOf(' ', desc.indexOf(' ') + 1))} (inherited from default-src)`);
                }
            }
        });

        return explanation.join('\\n');
    }

    /**
     * Gets an emoji for a directive
     * @param {string} directiveName - The directive name
     * @returns {string} An emoji character
     */
    getDirectiveEmoji(directiveName) {
        const emojiMap = {
            'script-src': '📜',
            'style-src': '🎨',
            'img-src': '🖼️',
            'connect-src': '🔌',
            'font-src': '📝',
            'media-src': '🎬',
            'object-src': '🔧',
            'frame-src': '🪟',
            'frame-ancestors': '👪',
            'form-action': '📋',
            'base-uri': '🔗',
            'manifest-src': '📦',
            'worker-src': '👷',
            'default-src': '📌',
            'sandbox': '⚠️',
            // 'require-sri-for': '🔐',
            'trusted-types': '✅'
        };
        return emojiMap[directiveName] || '•';
    }

    /**
     * Explains the values for a directive
     * @param {string} directiveName - The directive name
     * @param {Array} values - The directive values
     * @returns {string} A descriptive explanation
     */
    explainDirectiveValues(directiveName, values) {
        const readableName = this.getDirectiveName(directiveName);
        
        if (values.includes("'none'")) {
            switch (directiveName) {
                case 'script-src':
                    return 'are blocked entirely';
                case 'style-src':
                    return 'are blocked entirely';
                case 'img-src':
                    return 'are blocked entirely';
                case 'connect-src':
                    return 'are blocked entirely';
                case 'font-src':
                    return 'are blocked entirely';
                case 'media-src':
                    return 'are blocked entirely';
                case 'object-src':
                    return 'are blocked entirely';
                case 'frame-src':
                    return 'are blocked entirely';
                case 'frame-ancestors':
                    return 'cannot be embedded anywhere';
                case 'form-action':
                    return 'are blocked entirely';
                case 'base-uri':
                    return 'are blocked entirely';
                case 'manifest-src':
                    return 'are blocked entirely';
                case 'worker-src':
                    return 'are blocked entirely';
                case 'default-src':
                    return 'are blocked entirely';
                case 'trusted-types':
                    return 'policies are blocked';
                default:
                    return 'are blocked entirely';
            }
        }

        const parts = [];
        if (values.includes("'self'")) {
            parts.push("from the same origin");
        }

        const schemes = values.filter(v => v.endsWith(':'));
        if (schemes.length > 0) {
            parts.push(`via ${schemes.join(', ')} schemes`);
        }

        if (values.includes("'unsafe-inline'")) {
            parts.push("as inline code (unsafe)");
        }
        if (values.includes("'unsafe-eval'")) {
            parts.push("using dynamic code evaluation (unsafe)");
        }
        if (values.includes("'strict-dynamic'")) {
            parts.push("from trusted script-loaded sources");
        }

        const nonces = values.filter(v => v.startsWith('nonce-'));
        if (nonces.length > 0) {
            parts.push("with specific nonce validation");
        }

        const hashes = values.filter(v => v.startsWith("'sha"));
        if (hashes.length > 0) {
            parts.push("with specific hash validation");
        }

        const customSources = values.filter(v => 
            !v.startsWith("'") && 
            !v.endsWith(':') && 
            !v.startsWith('nonce-'));
        if (customSources.length > 0) {
            // Simply join domains with spaces
            parts.push(`from these domains: ${customSources.map(s => `<code>${s}</code>`).join(' ')}`);
        }
        
        const result = this.getDirectiveExplanation(readableName, parts);
        
        // Remove extra commas when domains list is present
        return result.replace(', <div class="domains-list">', '<div class="domains-list">');
    }

    /**
     * Gets a readable name for a directive
     * @param {string} directive - The directive name
     * @returns {string} A readable name
     */
    getDirectiveName(directive) {
        const nameMap = {
            'script-src': 'Scripts',
            'style-src': 'Styles',
            'img-src': 'Images',
            'connect-src': 'Network connections',
            'font-src': 'Fonts',
            'media-src': 'Media',
            'object-src': 'Plugins',
            'frame-src': 'Frames',
            'frame-ancestors': 'Parent frames',
            'form-action': 'Form submissions',
            'base-uri': 'Base URI',
            'manifest-src': 'Manifests',
            'worker-src': 'Workers',
            'default-src': 'Resources',
            'sandbox': 'Sandbox permissions',
            // 'require-sri-for': 'SRI requirements',
            'trusted-types': 'Trusted Types'
        };
        return nameMap[directive] || directive;
    }

    /**
     * Gets link text for a directive
     * @param {string} directiveName - The directive name
     * @returns {string} Link text
     */
    getLinkText(directiveName) {
        const nameMap = {
            'script-src': 'scripts',
            'style-src': 'styles',
            'img-src': 'images',
            'connect-src': 'connections',
            'font-src': 'fonts',
            'media-src': 'media',
            'object-src': 'plugins',
            'frame-src': 'frames',
            'frame-ancestors': 'frame ancestors',
            'form-action': 'form submissions',
            'base-uri': 'base URLs',
            'manifest-src': 'manifests',
            'worker-src': 'workers',
            'default-src': 'resources',
            'sandbox': 'sandbox',
            // 'require-sri-for': 'SRI',
            'trusted-types': 'trusted types'
        };
        return nameMap[directiveName] || directiveName;
    }

    /**
     * Updates the explanation section in the UI
     */
    updateExplanation() {
        const explanation = this.generateExplanation();
        
        // Create or update explanation element
        let explanationElement = document.getElementById('csp-explanation');
        if (!explanationElement) {
            explanationElement = document.createElement('div');
            explanationElement.id = 'csp-explanation';
            explanationElement.className = 'csp-explanation';
            this.outputElement.parentNode.insertBefore(explanationElement, this.outputElement.nextSibling);
        }
        explanationElement.innerHTML = explanation.split('\\n').map(line => `<p>${line}</p>`).join('');
    }

    // Add this helper method
    getDirectiveExplanation(readableName, parts) {
        switch (readableName) {
            case 'Scripts':
                return `Can load and execute scripts ${parts.join(', ')}`;
            case 'Styles':
                return `Can load and apply styles ${parts.join(', ')}`;
            case 'Images':
                return `Can load images ${parts.join(', ')}`;
            case 'Network connections':
                return `Can make network requests ${parts.join(', ')}`;
            case 'Fonts':
                return `Can load fonts ${parts.join(', ')}`;
            case 'Media':
                return `Can load media files ${parts.join(', ')}`;
            case 'Plugins':
                return `Can load plugins ${parts.join(', ')}`;
            case 'Frames':
                return `Can load frames ${parts.join(', ')}`;
            case 'Parent frames':
                return `Can be embedded ${parts.join(', ')}`;
            case 'Form submissions':
                return `Can submit forms ${parts.join(', ')}`;
            case 'Base URI':
                return `Can use base URLs ${parts.join(', ')}`;
            case 'Manifests':
                return `Can load manifests ${parts.join(', ')}`;
            case 'Workers':
                return `Can load workers ${parts.join(', ')}`;
            case 'Resources':
                return `Resources can be loaded ${parts.join(', ')}`;
            case 'Sandbox permissions':
                return `Sandbox allows ${parts.join(', ')}`;
            case 'SRI requirements':
                return `Requires integrity validation for ${parts.join(', ')}`;
            case 'Trusted Types':
                return `Allows Trusted Type policies ${parts.join(', ')}`;
            default:
                return `${readableName} can be loaded ${parts.join(', ')}`;
        }
    }
} 