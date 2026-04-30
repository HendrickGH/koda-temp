// Updates navbar (desktop + mobile) and footer Expertise across all HTML files.
// - Adds Automatización and Tienda en línea to the services submenu and mobile nav.
// - Adds Automatización and Tienda en línea to the footer Expertise column.
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
	// Match the entire <div class="nav-submenu">...</div> block.
	const re = /<div class="nav-submenu">[\s\S]*?<\/div>/;
	if (!re.test(content)) return content;

	const replacement =
		`<div class="nav-submenu">\n` +
		`\t\t\t\t\t\t\t<a href="${prefix}servicios/desarrollo-web/">Desarrollo web</a>\n` +
		`\t\t\t\t\t\t\t<a href="${prefix}servicios/branding/">Branding</a>\n` +
		`\t\t\t\t\t\t\t<a href="${prefix}servicios/marketing-redes/">Marketing &amp; redes</a>\n` +
		`\t\t\t\t\t\t\t<a href="${prefix}servicios/automatizacion/">Automatización</a>\n` +
		`\t\t\t\t\t\t\t<a href="${prefix}servicios/tienda-en-linea/">Tienda en línea</a>\n` +
		`\t\t\t\t\t\t</div>`;

	return content.replace(re, replacement);
}

// For the mobile nav, we only inject the missing service items right after
// the existing Marketing & redes / Automatización entries — preserving any
// active state on top-level items (Servicios / Presencia / Blog / Sobre nosotros).
function updateMobileSubmenu(content, prefix) {
	// Already up to date?
	if (content.includes(`href="${prefix}servicios/tienda-en-linea/"`) &&
		content.includes(`href="${prefix}servicios/automatizacion/"\n`) === false) {
		// continue — we still want to ensure both exist as mobile-subnav rows
	}

	const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const marketingLineRe = new RegExp(
		`(<a\\s+href="${escapedPrefix}servicios/marketing-redes/"[^>]*class="mobile-subnav"[^>]*>Marketing(?:\\s|&amp;|&)+redes</a>)`,
		'i'
	);

	if (!marketingLineRe.test(content)) {
		// Try alternative formatting (multi-line attributes).
		const altRe = new RegExp(
			`(<a[\\s\\S]*?href="${escapedPrefix}servicios/marketing-redes/"[\\s\\S]*?class="mobile-subnav"[\\s\\S]*?>[\\s\\S]*?Marketing[\\s\\S]*?redes[\\s\\S]*?</a\\s*>)`,
			'i'
		);
		if (!altRe.test(content)) return content;

		const hasAuto = new RegExp(`href="${escapedPrefix}servicios/automatizacion/"[^>]*class="mobile-subnav"`).test(content) ||
			new RegExp(`href="${escapedPrefix}servicios/automatizacion/"[\\s\\S]{0,200}class="mobile-subnav"`).test(content);
		const hasTienda = new RegExp(`href="${escapedPrefix}servicios/tienda-en-linea/"[^>]*class="mobile-subnav"`).test(content) ||
			new RegExp(`href="${escapedPrefix}servicios/tienda-en-linea/"[\\s\\S]{0,200}class="mobile-subnav"`).test(content);

		let injection = '';
		if (!hasAuto) {
			injection += `\n\t\t\t\t\t<a href="${prefix}servicios/automatizacion/" class="mobile-subnav" style="--d: 190ms">Automatización</a>`;
		}
		if (!hasTienda) {
			injection += `\n\t\t\t\t\t<a href="${prefix}servicios/tienda-en-linea/" class="mobile-subnav" style="--d: 210ms">Tienda en línea</a>`;
		}
		if (!injection) return content;

		return content.replace(altRe, (m) => m + injection);
	}

	const hasAuto = new RegExp(`href="${escapedPrefix}servicios/automatizacion/"[^>]*class="mobile-subnav"`).test(content);
	const hasTienda = new RegExp(`href="${escapedPrefix}servicios/tienda-en-linea/"[^>]*class="mobile-subnav"`).test(content);

	let injection = '';
	if (!hasAuto) {
		injection += `\n\t\t\t\t\t<a href="${prefix}servicios/automatizacion/" class="mobile-subnav" style="--d: 190ms">Automatización</a>`;
	}
	if (!hasTienda) {
		injection += `\n\t\t\t\t\t<a href="${prefix}servicios/tienda-en-linea/" class="mobile-subnav" style="--d: 210ms">Tienda en línea</a>`;
	}
	if (!injection) return content;

	return content.replace(marketingLineRe, (m) => m + injection);
}

// Detect the footer prefix for Expertise links. Same as services prefix
// when the footer sits at root, but when the file is under /servicios/<x>/
// the footer uses ../<sibling>/ instead of <prefix>servicios/<sibling>/.
// We look for the existing Expertise "Desarrollo web" link.
function updateFooterExpertise(content) {
	// Find the "Expertise" footer column block, which contains links to desarrollo-web/branding/marketing-redes.
	const blockRe = /<span class="flabel">Expertise<\/span>([\s\S]*?)<\/div>/;
	const m = content.match(blockRe);
	if (!m) return content;

	const inner = m[1];
	// Find the desarrollo-web href to learn the path prefix used here.
	const hrefMatch = inner.match(/href="([^"]*?)desarrollo-web\/"/);
	if (!hrefMatch) return content;
	const expertiseBase = hrefMatch[1]; // e.g. "../" or "../../servicios/" or "/servicios/"

	const desired =
		`<span class="flabel">Expertise</span>\n` +
		`\t\t\t\t\t\t\t<a href="${expertiseBase}desarrollo-web/">Desarrollo web</a>\n` +
		`\t\t\t\t\t\t\t<a href="${expertiseBase}branding/">Branding</a>\n` +
		`\t\t\t\t\t\t\t<a href="${expertiseBase}marketing-redes/">Marketing &amp; redes</a>\n` +
		`\t\t\t\t\t\t\t<a href="${expertiseBase}automatizacion/">Automatización</a>\n` +
		`\t\t\t\t\t\t\t<a href="${expertiseBase}tienda-en-linea/">Tienda en línea</a>\n` +
		`\t\t\t\t\t\t</div>`;

	return content.replace(blockRe, desired);
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

	if (content !== original) {
		fs.writeFileSync(file, content, 'utf8');
		touched++;
		console.log('updated:', file);
	}
}

console.log(`Done. ${touched} file(s) updated.`);
