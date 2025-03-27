/**
 * Templates class providing HTML template strings for the CSP Builder
 */
export class Templates {
    /**
     * Creates a directive section HTML template
     * @param {string} directiveId - The directive's unique ID
     * @param {Object} directive - The directive object
     * @returns {string} HTML template string
     */
    static directiveSection(directiveId, directive) {
        if (directive.type === 'boolean') {
            return this.booleanDirectiveSection(directiveId, directive);
        }
        return `
            <div class="section-header" id="${directive.name}">
                <h3><span class="directive-status" id="${directiveId}-status">🔲</span> ${directive.name}</h3>
            </div>
            <div class="directive-description" id="${directiveId}-description">
                ${directive.description}
            </div>
            <div class="section-content">
                <div class="values" id="${directiveId}-values"></div>
                <div class="value-input">
                    <input type="text" id="${directiveId}-input" placeholder="Add value...">
                    <button id="${directiveId}-add">Add</button>
                </div>
                ${directive.prefixes ? `
                <div class="prefixes">
                    <h4>Available Prefixes:</h4>
                    <div class="special-values" id="${directiveId}-prefixes"></div>
                </div>
                ` : ''}
                <div class="common-values">
                    <h4>Common Values:</h4>
                    <div class="special-values" id="${directiveId}-special"></div>
                </div>
            </div>
        `;
    }

    /**
     * Creates a boolean directive section HTML template
     * @param {string} directiveId - The directive's unique ID
     * @param {Object} directive - The directive object
     * @returns {string} HTML template string
     */
    static booleanDirectiveSection(directiveId, directive) {
        return `
            <div class="section-header" id="${directive.name}">
                <h3><span class="directive-status" id="${directiveId}-status">🔲</span> ${directive.name}</h3>
            </div>
            <div class="directive-description" id="${directiveId}-description">
                ${directive.description}
            </div>
            <div class="section-content">
                <div class="boolean-controls">
                    <div class="special-value" id="${directiveId}-disabled" data-value="disabled">Not specified</div>
                    <div class="special-value" id="${directiveId}-enabled" data-value="enabled">Enabled</div>
                </div>
            </div>
        `;
    }
    
    /**
     * Creates a value tag HTML template
     * @param {string} value - The value to display in the tag
     * @returns {string} HTML template string
     */
    static valueTag(value) {
        return `
            ${value}
            <button class="remove-value" data-value="${value}">×</button>
        `;
    }
    
    /**
     * Creates a parsed directive HTML template
     * @param {Object} directive - The parsed directive object
     * @returns {string} HTML template string
     */
    static parsedDirective(directive) {
        return `
            <strong>${directive.name}</strong>: ${directive.values.join(', ')}
        `;
    }

    /**
     * Creates the overlay HTML template for CSP parsing
     * @returns {string} HTML template string
     */
    static overlay() {
        return `
            <div class="overlay">
                <div class="overlay-content">
                    <h3>Parse CSP Header</h3>
                    <div class="textarea-wrapper">
                        <textarea id="csp-input" placeholder="Paste your CSP header here..."></textarea>
                        <div class="hint">Press Ctrl+Enter (Cmd+Enter on Mac) to load</div>
                    </div>
                    <div class="overlay-buttons">
                        <button id="overlay-cancel" class="btn btn-primary">Cancel</button>
                        <button id="overlay-load" class="btn btn-primary" disabled>Load into Builder</button>
                    </div>
                </div>
            </div>
        `;
    }
} 