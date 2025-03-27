import { Utils } from './utils.js';
import { Templates } from './templates.js';
import { cspDirectives } from './cspDirectives.js';

/**
 * Handles parsing and loading CSP headers
 */
export class CSPParser {
    /**
     * Creates a new CSPParser
     * @param {DirectiveManager} directiveManager - The directive manager instance
     */
    constructor(directiveManager) {
        this.directiveManager = directiveManager;
        this.overlay = null;
        this.parsedDirectives = null;
    }
    
    /**
     * Shows the CSP parsing overlay
     */
    showOverlay() {
        // Create and append overlay
        this.overlay = Utils.createElement(Templates.overlay());
        document.body.appendChild(this.overlay);
        
        // Get elements
        const input = this.overlay.querySelector('#csp-input');
        const loadButton = this.overlay.querySelector('#overlay-load');
        const cancelButton = this.overlay.querySelector('#overlay-cancel');
        
        // Focus the textarea
        input.focus();
        
        // Setup event listeners
        input.addEventListener('input', () => {
            this.parse(input.value.trim(), loadButton);
        });
        
        // Add keyboard shortcut for Cmd/Ctrl + Enter
        input.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                if (this.parsedDirectives && !loadButton.disabled) {
                    this.loadIntoBuilder(this.parsedDirectives);
                    this.closeOverlay();
                }
            }
        });
        
        loadButton.addEventListener('click', () => {
            if (this.parsedDirectives) {
                this.loadIntoBuilder(this.parsedDirectives);
            }
            this.closeOverlay();
        });
        
        cancelButton.addEventListener('click', () => this.closeOverlay());
    }
    
    /**
     * Closes the CSP parsing overlay
     */
    closeOverlay() {
        if (this.overlay) {
            document.body.removeChild(this.overlay);
            this.overlay = null;
            this.parsedDirectives = null;
        }
    }
    
    /**
     * Parses a CSP string and enables/disables the load button
     * @param {string} cspString - The CSP string to parse
     * @param {HTMLElement} loadButton - The load button element
     */
    parse(cspString, loadButton) {
        if (!cspString) {
            loadButton.disabled = true;
            this.parsedDirectives = null;
            return;
        }
        
        try {
            // Parse the CSP string
            this.parsedDirectives = Utils.parseCSPString(cspString);
            loadButton.disabled = false;
        } catch (error) {
            loadButton.disabled = true;
            this.parsedDirectives = null;
        }
    }
    
    /**
     * Loads parsed directives into the builder
     * @param {Array} parsedDirectives - The parsed directives
     */
    loadIntoBuilder(parsedDirectives) {
        // Clear existing values but keep the directives
        this.directiveManager.clear();
        
        // Update values for each parsed directive
        parsedDirectives.forEach(parsed => {
            const existingDirective = this.directiveManager.directives.find(d => d.name === parsed.name);
            if (existingDirective) {
                const directiveInfo = cspDirectives.find(d => d.name === parsed.name);
                if (directiveInfo && directiveInfo.type === 'boolean') {
                    existingDirective.values = ['enabled'];
                } else {
                    existingDirective.values = parsed.values;
                }
                this.directiveManager.updateDirectiveValues(existingDirective);
            }
        });

        // Update all directives to ensure inheritance status is properly reflected
        this.directiveManager.directives.forEach(directive => {
            this.directiveManager.updateDirectiveValues(directive);
        });
        
        this.directiveManager.updateOutput();
    }
} 