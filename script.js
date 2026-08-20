const fs = require('fs');
const path = require('path');

// === Configuration ===
const htmlFile = 'index.html';
const imagesDir = 'images';
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.JPG', '.JPEG', '.PNG', '.WEBP'];

// === 1. Lire toutes les images du dossier ===
const allFiles = fs.readdirSync(imagesDir)
  .filter(file => imageExtensions.some(ext => file.endsWith(ext)))
  .map(file => `images/${file}`);

// === 2. Extraire les images déjà présentes dans le tourniquet ===
const html = fs.readFileSync(htmlFile, 'utf8');

const tourniquetRegex = /<div class="tourniquet-item">\s*<img src="([^"]+)"/g;
const tourniquetImages = [];
let match;
while ((match = tourniquetRegex.exec(html)) !== null) {
  tourniquetImages.push(match[1]);
}

// === 3. Calculer les images supplémentaires ===
const extraImages = allFiles.filter(img => !tourniquetImages.includes(img));

// === 4. Générer le nouveau tableau ===
const extraArray = extraImages.length > 0
  ? extraImages.map(img => `            '${img}'`).join(',\n')
  : '';

const newExtraBlock = `        const extraGalleryImages = [
${extraArray}
        ];`;

// === 5. Remplacer dans le HTML ===
const updatedHtml = html.replace(
  /const extraGalleryImages = \[[\s\S]*?\];/,
  newExtraBlock
);

fs.writeFileSync(htmlFile, updatedHtml, 'utf8');

// === Résumé ===
console.log('✅ Galerie mise à jour avec succès !');
console.log(`📸 Images dans le tourniquet : ${tourniquetImages.length}`);
console.log(`🖼️  Images supplémentaires ajoutées : ${extraImages.length}`);
if (extraImages.length > 0) {
  console.log('\nImages ajoutées à la galerie + ZIP :');
  extraImages.forEach(img => console.log('  -', img));
} else {
  console.log('\nAucune image supplémentaire trouvée.');
}