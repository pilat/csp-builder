/**
 * Content Security Policy directives and their configurations
 * Each directive contains metadata, descriptions, and common values
 */
export const cspDirectives = [
    { 
        name: "default-src", 
        type: "list",
        description: "Serves as a fallback for the other fetch directives. Applies to all resources that don't have a more specific directive. Also controls inline scripts/styles and dynamic code execution if script-src/style-src are not set.",
        common: [
            // Basic sources
            { value: "'self'", description: "Allows loading resources from the same origin (same scheme, host and port)" },
            { value: "'none'", description: "Prevents loading resources from any source" },
            
            // Security-related keywords
            { value: "'unsafe-inline'", description: "Allows inline scripts/styles and event handlers (unsafe, use nonce/hash instead)" },
            { value: "'unsafe-eval'", description: "Allows use of eval() and similar dynamic code execution" },
            { value: "'unsafe-hashes'", description: "Allows inline event handlers using their hash values (safer than unsafe-inline)" },
            { value: "'strict-dynamic'", description: "Allows scripts loaded by trusted scripts, ignoring allowlist" },
            
            // Protocol schemes (secure first)
            { value: "https:", description: "Allows loading resources from any source using HTTPS" },
            { value: "wss:", description: "Allows secure WebSocket connections" },
            { value: "http:", description: "Allows loading resources from any source using HTTP (insecure)" },
            { value: "ws:", description: "Allows WebSocket connections (insecure)" },
            
            // Special schemes
            { value: "blob:", description: "Allows loading resources via the blob: scheme (binary data)" },
            { value: "data:", description: "Allows loading resources via the data: scheme (inline data)" },
            { value: "file:", description: "Allows loading resources from the file system" }
        ],
        prefixes: [
            { prefix: "nonce-", description: "Prefix for nonce values to allow specific inline scripts/styles. Example: nonce-abc123" }
        ]
    },
    { 
        name: "script-src", 
        type: "list",
        description: "Inherits from default-src if not set. Controls which scripts can be loaded and executed on the page. This includes inline scripts, event handlers, and dynamic code execution.",
        common: [
            // Basic sources
            { value: "'self'", description: "Allows loading scripts from the same origin" },
            { value: "'none'", description: "Prevents loading scripts from any source" },
            
            // Security-related keywords
            { value: "'unsafe-inline'", description: "Allows inline scripts and event handlers (unsafe, use nonce/hash instead)" },
            { value: "'unsafe-eval'", description: "Allows use of eval() and similar dynamic code execution" },
            { value: "'unsafe-hashes'", description: "Allows inline event handlers using their hash values (safer than unsafe-inline)" },
            { value: "'strict-dynamic'", description: "Allows scripts loaded by trusted scripts, ignoring allowlist" },
            
            // Protocol schemes (secure first)
            { value: "https:", description: "Allows loading scripts from any source using HTTPS" },
            
            // Special schemes (potentially dangerous)
            { value: "blob:", description: "Allows scripts from blob: URLs" },
            { value: "data:", description: "Allows scripts from data: URIs (highly discouraged)" }
        ],
        prefixes: [
            { prefix: "nonce-", description: "Prefix for nonce values to allow specific inline scripts. Example: nonce-abc123" },
            { prefix: "'sha256-'", description: "Prefix for SHA-256 hash values to allow specific inline scripts. Example: 'sha256-hashvalue'" },
            { prefix: "'sha384-'", description: "Prefix for SHA-384 hash values to allow specific inline scripts. Example: 'sha384-hashvalue'" },
            { prefix: "'sha512-'", description: "Prefix for SHA-512 hash values to allow specific inline scripts. Example: 'sha512-hashvalue'" }
        ]
    },
    { 
        name: "style-src", 
        type: "list",
        description: "Inherits from default-src if not set. Controls which stylesheets can be loaded on the page, including inline styles and style attributes.",
        common: [
            // Basic sources
            { value: "'self'", description: "Allows loading styles from the same origin" },
            { value: "'none'", description: "Prevents loading styles from any source" },
            
            // Security-related keywords
            { value: "'unsafe-inline'", description: "Allows inline styles and style attributes (unsafe, use nonce/hash instead)" },
            
            // Protocol schemes (secure first)
            { value: "https:", description: "Allows loading styles from any source using HTTPS" },
            
            // Special schemes
            { value: "blob:", description: "Allows styles from blob: URLs" },
            { value: "data:", description: "Allows styles from data: URIs" }
        ],
        prefixes: [
            { prefix: "nonce-", description: "Prefix for nonce values to allow specific inline styles. Example: nonce-abc123" },
            { prefix: "'sha256-'", description: "Prefix for SHA-256 hash values to allow specific inline styles. Example: 'sha256-hashvalue'" },
            { prefix: "'sha384-'", description: "Prefix for SHA-384 hash values to allow specific inline styles. Example: 'sha384-hashvalue'" },
            { prefix: "'sha512-'", description: "Prefix for SHA-512 hash values to allow specific inline styles. Example: 'sha512-hashvalue'" }
        ]
    },
    { 
        name: "img-src", 
        type: "list",
        description: "Inherits from default-src if not set. Controls which images can be loaded on the page.",
        common: [
            // Basic sources
            { value: "'self'", description: "Allows loading images from the same origin" },
            { value: "'none'", description: "Prevents loading images from any source" },
            
            // Protocol schemes (secure first)
            { value: "https:", description: "Allows loading images from any source using HTTPS" },
            
            // Special schemes
            { value: "blob:", description: "Allows images from blob: URLs" },
            { value: "data:", description: "Allows images from data: URIs (base64 encoded images)" }
        ]
    },
    { 
        name: "connect-src", 
        type: "list",
        description: "Inherits from default-src if not set. Controls which connections can be made using script interfaces (fetch, XHR, WebSocket, EventSource).",
        common: [
            // Basic sources
            { value: "'self'", description: "Allows connections to the same origin" },
            { value: "'none'", description: "Prevents all network connections" },
            
            // Protocol schemes (secure first)
            { value: "https:", description: "Allows connections to any source using HTTPS" },
            { value: "wss:", description: "Allows secure WebSocket connections" },
            { value: "ws:", description: "Allows WebSocket connections (insecure)" },
            
            // Special schemes
            { value: "blob:", description: "Allows connections to blob: URLs" },
            { value: "data:", description: "Allows connections to data: URIs" }
        ]
    },
    { 
        name: "font-src", 
        type: "list",
        description: "Inherits from default-src if not set. Controls which fonts can be loaded on the page.",
        common: [
            { value: "'self'", description: "Allows loading fonts from the same origin" },
            { value: "'none'", description: "Prevents loading fonts from any source" },
            { value: "data:", description: "Allows fonts from data: URIs" },
            { value: "https:", description: "Allows loading fonts from any source using HTTPS" },
            { value: "blob:", description: "Allows fonts from blob: URLs" }
        ]
    },
    { 
        name: "object-src", 
        type: "list",
        description: "Inherits from default-src if not set. Controls which plugins can be loaded on the page (object, embed, applet).",
        common: [
            { value: "'none'", description: "Prevents loading plugins from any source (recommended)" },
            { value: "'self'", description: "Allows loading plugins from the same origin" }
        ]
    },
    { 
        name: "media-src", 
        type: "list",
        description: "Inherits from default-src if not set. Controls which media (audio and video) can be loaded on the page.",
        common: [
            { value: "'self'", description: "Allows loading media from the same origin" },
            { value: "'none'", description: "Prevents loading media from any source" },
            { value: "https:", description: "Allows loading media from any source using HTTPS" },
            { value: "blob:", description: "Allows media from blob: URLs" },
            { value: "data:", description: "Allows media from data: URIs" }
        ]
    },
    { 
        name: "frame-src", 
        type: "list",
        description: "Inherits from default-src if not set. Controls which pages can be framed (iframe, frame).",
        common: [
            { value: "'self'", description: "Allows framing pages from the same origin" },
            { value: "https:", description: "Allows framing pages from any source using HTTPS" },
            { value: "'none'", description: "Prevents framing from any source" }
        ]
    },
    { 
        name: "frame-ancestors", 
        type: "list",
        description: "Controls which pages can embed this page (protects against clickjacking).",
        common: [
            { value: "'self'", description: "Allows embedding by pages from the same origin" },
            { value: "'none'", description: "Prevents embedding by any page (most restrictive)" },
            { value: "https:", description: "Allows embedding by any page using HTTPS" }
        ]
    },
    { 
        name: "worker-src", 
        type: "list",
        description: "Inherits from default-src if not set. Controls which scripts can be loaded as workers, shared workers, or service workers.",
        common: [
            { value: "'self'", description: "Allows loading workers from the same origin" },
            { value: "'none'", description: "Prevents loading any workers" },
            { value: "blob:", description: "Allows workers from blob: URLs" },
            { value: "data:", description: "Allows workers from data: URIs" },
            { value: "https:", description: "Allows loading workers from any source using HTTPS" }
        ]
    },
    { 
        name: "manifest-src", 
        type: "list",
        description: "Inherits from default-src if not set. Controls which manifests can be loaded for the page.",
        common: [
            { value: "'self'", description: "Allows loading manifests from the same origin" },
            { value: "'none'", description: "Prevents loading manifests from any source" },
            { value: "https:", description: "Allows loading manifests from any source using HTTPS" }
        ]
    },
    { 
        name: "form-action", 
        type: "list",
        description: "Controls which URLs can be used as the target of form submissions.",
        common: [
            { value: "'self'", description: "Allows forms to submit to the same origin" },
            { value: "https:", description: "Allows forms to submit to any HTTPS URL" },
            { value: "'none'", description: "Prevents form submissions entirely" }
        ]
    },
    { 
        name: "base-uri", 
        type: "list",
        description: "Controls which URLs can be used as the base URL for the page.",
        common: [
            { value: "'self'", description: "Allows only same-origin URLs as the base URL" },
            { value: "'none'", description: "Prevents the use of base URLs" }
        ]
    },
    { 
        name: "upgrade-insecure-requests", 
        type: "boolean",
        description: "Instructs browsers to upgrade HTTP requests to HTTPS before fetching.",
        common: [] 
    },
    { 
        name: "block-all-mixed-content", 
        type: "boolean",
        description: "Blocks all mixed content (HTTP resources on HTTPS pages).",
        common: [] 
    },
    // { 
    //     name: "require-sri-for", 
    //     type: "list",
    //     description: "Requires Subresource Integrity for scripts and/or styles.",
    //     common: [
    //         { value: "script", description: "Requires SRI for scripts" },
    //         { value: "style", description: "Requires SRI for stylesheets" },
    //         { value: "script style", description: "Requires SRI for both scripts and stylesheets" }
    //     ]
    // },
    { 
        name: "trusted-types", 
        type: "list",
        description: "Controls which Trusted Types policies can be used (helps prevent DOM XSS).",
        common: [
            { value: "'none'", description: "Disallows all Trusted Types policies" },
            { value: "default", description: "Allows a default policy" }
        ]
    },
    { 
        name: "sandbox", 
        type: "list",
        description: "Enables a sandbox for the page, similar to the iframe sandbox attribute.",
        common: [
            { value: "allow-forms", description: "Allows form submission" },
            { value: "allow-scripts", description: "Allows script execution" },
            { value: "allow-same-origin", description: "Allows same-origin requests" },
            { value: "allow-popups", description: "Allows popups" },
            { value: "allow-top-navigation", description: "Allows navigation of the top-level browsing context" }
        ]
    }
]; 