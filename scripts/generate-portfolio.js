const fs = require('fs');
const path = require('path');

const portfolioDir = path.join(__dirname, '..', 'src', 'assets', 'portfolio', 'all');
const outputFile = path.join(__dirname, '..', 'src', 'assets', 'portfolio', 'images.json');

function generateImagesJson() {
    try {
        if (!fs.existsSync(portfolioDir)) {
            console.error(`Directory not found: ${portfolioDir}`);
            fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
            return;
        }

        const files = fs.readdirSync(portfolioDir);
        const images = files
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map((file, index) => ({
                id: index + 1,
                image: `assets/portfolio/all/${file}`,
                title: file.split('.')[0]
            }));

        fs.writeFileSync(outputFile, JSON.stringify(images, null, 2));
        console.log(`Successfully generated images.json with ${images.length} images.`);
    } catch (error) {
        console.error('Error generating images.json:', error);
        fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    }
}

generateImagesJson();
