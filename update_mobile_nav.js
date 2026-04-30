// Rebuilds the <nav class="mobile-nav-inner"> block consistently across all
// HTML files. Preserves the page's active state by detecting which top-level
// link currently has class="is-active".

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

function detectServicesPrefix(content) {
	const m = content.match(/href="((?:\.\.\/)*)servicios\/desarrollo-web\/"/);
	return m ? m[1] : null;
}

// Detect which top-level item is active, by inspecting the existing mobile nav.
// Returns one of: 'servicios' | 'presencia' | 'blog' | 'sobre' | null.
function detectActive(navInner) {
	const active = (re) => re.test(navInner);
	if (active(/href="[^"]*\/sobre-nosotros\/"[^>]*class="is-active"|class="is-active"[^>]*href="[^"]*\/sobre-nosotros\/"/)) return 'sobre';
	if (active(/href="[^"]*\/blog\/"[^>]*class="is-active"|class="is-active"[^>]*href="[^"]*\/blog\/"/)) return 'blog';
	if (active(/href="[^"]*\/digitalizamos\/?"[^>]*class="is-active"|class="is-active"[^>]*href="[^"]*\/digitalizamos\//)) return 'presencia';
	if (active(/href="[^"]*\/servicios\/?"[^>]*class="is-active"|class="is-active"[^>]*href="[^"]*\/servicios\//)) return 'servicios';
	return null;
}

function buildMobileNav(prefix, active) {
	const cls = (key) => (active === key ? ' class="is-active"' : '');
	return (
		`<nav class="mobile-nav-inner" aria-label="Navegación móvil">\n` +
		`\t\t\t\t\t<a href="${prefix}servicios/" style="--d: 60ms"${cls('servicios')}>Servicios</a>\n` +
		`\t\t\t\t\t<a href="${prefix}servicios/desarrollo-web/" class="mobile-subnav" style="--d: 100ms">Desarrollo web</a>\n` +
		`\t\t\t\t\t<a href="${prefix}servicios/branding/" class="mobile-subnav" style="--d: 130ms">Branding</a>\n` +
		`\t\t\t\t\t<a href="${prefix}servicios/marketing-redes/" class="mobile-subnav" style="--d: 160ms">Marketing &amp; redes</a>\n` +
		`\t\t\t\t\t<a href="${prefix}servicios/automatizacion/" class="mobile-subnav" style="--d: 190ms">Automatización</a>\n` +
		`\t\t\t\t\t<a href="${prefix}servicios/tienda-en-linea/" class="mobile-subnav" style="--d: 210ms">Tienda en línea</a>\n` +
		`\t\t\t\t\t<a href="${prefix}digitalizamos/" style="--d: 240ms"${cls('presencia')}>Presencia</a>\n` +
		`\t\t\t\t\t<a href="${prefix}blog/" style="--d: 280ms"${cls('blog')}>Blog</a>\n` +
		`\t\t\t\t\t<a href="${prefix}sobre-nosotros/" style="--d: 320ms"${cls('sobre')}>Sobre nosotros</a>\n` +
		`\t\t\t\t</nav>`
	);
}

const files = findHtmlFiles('.');
let touched = 0;

for (const file of files) {
	let content = fs.readFileSync(file, 'utf8');
	const prefix = detectServicesPrefix(content);
	if (prefix === null) continue;

	const blockRe = /<nav class="mobile-nav-inner"[\s\S]*?<\/nav>/;
	const m = content.match(blockRe);
	if (!m) continue;

	const active = detectActive(m[0]);
	const replacement = buildMobileNav(prefix, active);

	if (m[0] === replacement) continue;
	content = content.replace(blockRe, replacement);
	fs.writeFileSync(file, content, 'utf8');
	touched++;
	console.log('updated:', file, '(active:', active || 'none', ')');
}

console.log(`Done. ${touched} file(s) updated.`);
