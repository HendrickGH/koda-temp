// Updates navbar (desktop + mobile), footer Expertise, and footer Contact across all HTML files.
// Adds Rediseño de marca to navbars and footer Expertise.
// Updates footer Contact with phone, full address, and social links (matching index.html template).
// Idempotent: safe to run multiple times.

const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir, fileList = []) {
	for (const file of fs.readdirSync(dir)) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			if (!['node_modules', '.git', 'dist', 'fonts', 'assets', 'uploads', 'scratch'].includes(file)) {
				findHtmlFiles(filePath, fileList);
			}
		} else if (filePath.endsWith('.html')) {
			fileList.push(filePath);
		}
	}
	return fileList;
}

// Detect the relative prefix that the file uses to reach /servicios/.
// Looks for an existing href="<prefix>servicios/desarrollo-web/" pattern.
function detectServicesPrefix(content) {
	const m = content.match(/href="((?:\.\.\/)*)servicios\/desarrollo-web\/"/);
	return m ? m[1] : null;
}

function updateDesktopSubmenu(content, prefix) {
	const re = /<div class="nav-submenu">[\s\S]*?<\/div>/;
	if (!re.test(content)) return content;

	const replacement =
		`<div class="nav-submenu">\n` +
		`\t\t\t\t\t\t\t<a href="${prefix}servicios/desarrollo-web/">Desarrollo web</a>\n` +
		`\t\t\t\t\t\t\t<a href="${prefix}servicios/branding/">Branding</a>\n` +
		`\t\t\t\t\t\t\t<a href="${prefix}servicios/rediseno-marca/">Rediseño de marca</a>\n` +
		`\t\t\t\t\t\t\t<a href="${prefix}servicios/marketing-redes/">Marketing &amp; redes</a>\n` +
		`\t\t\t\t\t\t\t<a href="${prefix}servicios/automatizacion/">Automatización</a>\n` +
		`\t\t\t\t\t\t\t<a href="${prefix}servicios/tienda-en-linea/">Tienda en línea</a>\n` +
		`\t\t\t\t\t\t</div>`;

	return content.replace(re, replacement);
}

function updateMobileSubmenu(content, prefix) {
	const ep = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	// Match the entire block from desarrollo-web mobile-subnav to tienda-en-linea mobile-subnav
	const blockRe = new RegExp(
		`<a\\s+href="${ep}servicios/desarrollo-web/"\\s+class="mobile-subnav"[^>]*>[^<]*<\\/a>[\\s\\S]*?` +
		`<a\\s+href="${ep}servicios/tienda-en-linea/"\\s+class="mobile-subnav"[^>]*>[^<]*<\\/a>`
	);

	if (!blockRe.test(content)) return content;

	const replacement =
		`<a href="${prefix}servicios/desarrollo-web/" class="mobile-subnav" style="--d: 100ms">Desarrollo web</a>\n` +
		`\t\t\t\t\t<a href="${prefix}servicios/branding/" class="mobile-subnav" style="--d: 125ms">Branding</a>\n` +
		`\t\t\t\t\t<a href="${prefix}servicios/rediseno-marca/" class="mobile-subnav" style="--d: 150ms">Rediseño de marca</a>\n` +
		`\t\t\t\t\t<a href="${prefix}servicios/marketing-redes/" class="mobile-subnav" style="--d: 175ms">Marketing &amp; redes</a>\n` +
		`\t\t\t\t\t<a href="${prefix}servicios/automatizacion/" class="mobile-subnav" style="--d: 200ms">Automatización</a>\n` +
		`\t\t\t\t\t<a href="${prefix}servicios/tienda-en-linea/" class="mobile-subnav" style="--d: 225ms">Tienda en línea</a>`;

	return content.replace(blockRe, replacement);
}

function updateFooterExpertise(content) {
	const blockRe = /<span class="flabel">Expertise<\/span>([\s\S]*?)<\/div>/;
	const m = content.match(blockRe);
	if (!m) return content;

	const inner = m[1];
	let expertiseBase = null;

	// Try to detect prefix from desarrollo-web link
	const hrefMatch = inner.match(/href="([^"]*?)desarrollo-web\/"/);
	if (hrefMatch) {
		expertiseBase = hrefMatch[1];
	} else {
		// Blog pages use #expertise anchors — detect their prefix and build servicios path
		const anchorMatch = inner.match(/href="([^"]*?)#expertise"/);
		if (anchorMatch) {
			expertiseBase = anchorMatch[1] + 'servicios/';
		}
	}

	if (!expertiseBase) return content;

	const desired =
		`<span class="flabel">Expertise</span>\n` +
		`\t\t\t\t\t\t\t<a href="${expertiseBase}desarrollo-web/">Desarrollo web</a>\n` +
		`\t\t\t\t\t\t\t<a href="${expertiseBase}branding/">Branding</a>\n` +
		`\t\t\t\t\t\t\t<a href="${expertiseBase}rediseno-marca/">Rediseño de marca</a>\n` +
		`\t\t\t\t\t\t\t<a href="${expertiseBase}marketing-redes/">Marketing &amp; redes</a>\n` +
		`\t\t\t\t\t\t\t<a href="${expertiseBase}automatizacion/">Automatización</a>\n` +
		`\t\t\t\t\t\t\t<a href="${expertiseBase}tienda-en-linea/">Tienda en línea</a>\n` +
		`\t\t\t\t\t\t</div>`;

	return content.replace(blockRe, desired);
}

function updateFooterContact(content) {
	// Already has full address + phone? Skip.
	if (content.includes('Campeche 76-42, Roma Sur') && content.includes('tel:+527721698485')) {
		return content;
	}

	const contactIdx = content.lastIndexOf('<span class="flabel">Contacto</span>');
	if (contactIdx === -1) return content;

	// Find the opening <div> of the contact column (last <div before Contacto span)
	const beforeContact = content.substring(0, contactIdx);
	const lastDivOpenIdx = beforeContact.lastIndexOf('<div');
	if (lastDivOpenIdx === -1) return content;

	// Find the LINE containing <div class="footer-bottom"> to anchor the end of footer-cols
	// Use partial match so it works even when the div has extra style attributes
	const footerBottomDivIdx = content.indexOf('<div class="footer-bottom"', contactIdx);
	if (footerBottomDivIdx === -1) return content;
	// Find the \n that starts the footer-bottom line so we preserve its indentation
	const lineBeforeFooterBottom = content.lastIndexOf('\n', footerBottomDivIdx);

	// Get colIndent: the actual tabs that precede the contact <div on its line
	// content.substring(0, lastDivOpenIdx) ends with those tabs (they are already there)
	const lineStart = content.lastIndexOf('\n', lastDivOpenIdx) + 1;
	const colIndent = content.substring(lineStart, lastDivOpenIdx);

	// Count divs in the section from contact <div> to the footer-bottom line
	// to determine how many parent closing divs we need to regenerate
	const originalSection = content.substring(lastDivOpenIdx, lineBeforeFooterBottom);
	const openDivs = (originalSection.match(/<div/g) || []).length;
	const closeDivs = (originalSection.match(/<\/div>/g) || []).length;
	const parentClosings = closeDivs - openDivs; // parent divs closed after contact column

	// Build new contact div. NO leading colIndent — content.substring(0, lastDivOpenIdx)
	// already ends with those tabs, so we start directly with <div>.
	const newContact =
		`<div>\n` +
		`${colIndent}\t<span class="flabel">Contacto</span>\n` +
		`${colIndent}\t<a href="mailto:contacto@kodastudio.com.mx">contacto@kodastudio.com.mx</a>\n` +
		`${colIndent}\t<a href="tel:+527721698485">+52 772 169 8485</a>\n` +
		`${colIndent}\t<span style="display: block; margin-top: 1rem; color: #8A9BAC; font-size: 0.875rem;">Campeche 76-42, Roma Sur<br>Cuauhtémoc, 06760 CDMX</span>\n` +
		`${colIndent}\t<div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">\n` +
		`${colIndent}\t\t<a href="https://www.instagram.com/kodastudiodesign/" target="_blank" rel="noopener noreferrer">Instagram</a>\n` +
		`${colIndent}\t\t<a href="https://linkedin.com/company/koda-studio-design" target="_blank" rel="noopener noreferrer">LinkedIn</a>\n` +
		`${colIndent}\t</div>\n` +
		`${colIndent}</div>\n`;

	// Build parent closing divs (footer-cols, footer-top, …) with correct indentation
	let closingDivs = '';
	for (let i = 0; i < parentClosings; i++) {
		const parentIndent = colIndent.substring(0, colIndent.length - (i + 1));
		closingDivs += `${parentIndent}</div>\n`;
	}

	// Replace from the contact <div opening to (not including) the \n before footer-bottom.
	// content.substring(lineBeforeFooterBottom) = '\n' + indent + '<div class="footer-bottom">...'
	return content.substring(0, lastDivOpenIdx) + newContact + closingDivs + content.substring(lineBeforeFooterBottom);
}

const files = findHtmlFiles('.');
let touched = 0;

for (const file of files) {
	let content = fs.readFileSync(file, 'utf8');
	const original = content;

	const prefix = detectServicesPrefix(content);
	if (prefix !== null) {
		content = updateDesktopSubmenu(content, prefix);
		content = updateMobileSubmenu(content, prefix);
	}
	content = updateFooterExpertise(content);
	content = updateFooterContact(content);

	if (content !== original) {
		fs.writeFileSync(file, content, 'utf8');
		touched++;
		console.log('updated:', file);
	}
}

console.log(`Done. ${touched} file(s) updated.`);
