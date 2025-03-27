/**
 * Utility class providing helper methods for the CSP Builder
 */
export class Utils {
    /**
     * Generates a random ID for directives
     * @returns {string} A random ID
     */
    static generateId() {
        return `directive-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Creates a DOM element from an HTML string
     * @param {string|HTMLElement} html - HTML string or existing element
     * @returns {HTMLElement} The created element
     */
    static createElement(html) {
        if (typeof html === 'string') {
            const template = document.createElement('template');
            template.innerHTML = html.trim();
            return template.content.firstElementChild;
        }
        return html;
    }
    
    /**
     * Parses a CSP string into structured directives
     * @param {string} cspString - The CSP string to parse
     * @returns {Array} An array of parsed directive objects
     */
    static parseCSPString(cspString) {
        const directiveParts = cspString.split(';').map(part => part.trim()).filter(part => part);
        const parsedDirectives = [];
        
        directiveParts.forEach(part => {
            const tokens = this.tokenizeDirective(part);
            
            if (tokens.length > 0) {
                parsedDirectives.push({
                    name: tokens[0],
                    values: tokens.slice(1)
                });
            }
        });
        
        return parsedDirectives;
    }
    
    /**
     * Tokenizes a CSP directive string, respecting quoted values
     * @param {string} directiveString - A single CSP directive string
     * @returns {Array} An array of tokens
     */
    static tokenizeDirective(directiveString) {
        const tokens = [];
        let currentToken = '';
        let inQuote = false;
        
        for (let i = 0; i < directiveString.length; i++) {
            const char = directiveString[i];
            if (char === "'" && (i === 0 || directiveString[i-1] !== '\\')) {
                inQuote = !inQuote;
                currentToken += char;
            } else if (char === ' ' && !inQuote) {
                if (currentToken) {
                    tokens.push(currentToken);
                    currentToken = '';
                }
            } else {
                currentToken += char;
            }
        }
        
        if (currentToken) {
            tokens.push(currentToken);
        }
        
        return tokens;
    }
} 