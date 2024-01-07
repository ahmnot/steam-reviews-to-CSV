const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const currentYear = new Date().getFullYear();

// Lire le contenu HTML du fichier
fs.readFile('steam_reviews.html', 'utf8', (err, htmlContent) => {
    if (err) {
        console.error("Erreur lors de la lecture du fichier :", err);
        return;
    }

    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    const reviews = document.querySelectorAll('.apphub_Card');
    let csvContent = 'Recommande;Utile;Amusant;Heures;Date;Commentaire;NombreProduitEnregistres;AccesAnticipe;Rembourse;RecuGratuitement;Rewards\n';

    reviews.forEach(review => {
        const recommended = review.querySelector('.title').textContent.includes('Recommandé') ? '1' : '0';

        const foundHelpful = review.querySelector('.found_helpful');
        let hours = review.querySelector('.hours').textContent.trim().replace('h en tout', '').trim();
        hours = hours.replace('.', ',');

        let datePosted = review.querySelector('.date_posted').textContent.trim().replace('Évaluation publiée le', '').trim();

        // Vérifier si une année est présente dans la date
        if (!/\d{4}/.test(datePosted)) {
            datePosted += ` ${currentYear}`;
        }

        // Extraction du commentaire
        let comment = review.querySelector('.apphub_CardTextContent').textContent.trim();

        comment = comment.replace(/Avis donné pendant l'accès anticipé\s*/, '');
        comment = comment.replace(/Produit remboursé\s*/, '');
        comment = comment.replace(/Produit reçu gratuitement\s*/, '');

        // Suppression de la date du début du commentaire
        comment = comment.replace(/^Évaluation publiée le \d+ [a-zA-Zéû]+(?: \d{4})?\s*/, '');

        let productsRegistered = review.querySelector('.apphub_CardContentMoreLink') ?
            review.querySelector('.apphub_CardContentMoreLink').textContent.trim() : 'N/A';
        productsRegistered = productsRegistered.replace(/[^0-9]/g, '');

        const earlyAccessReview = review.querySelector('.early_access_review') ? '1' : '0';
        const refunded = review.querySelector('.refunded') ? '1' : '0';
        const receivedCompensation = review.querySelector('.received_compensation') ? '1' : '0';

        let helpful = '0';
        let funny = '0';

        if (foundHelpful) {
            // Utiliser innerHTML pour obtenir le contenu HTML brut
            const htmlContent = foundHelpful.innerHTML;

            // Extraire les valeurs "utiles"
            let helpfulMatch = htmlContent.match(/(\d+) personne(?:s ont| a) trouvé cette évaluation utile/);
            if (!helpfulMatch && /Personne n'a trouvé cette évaluation utile/.test(htmlContent)) {
                helpful = '0';
            } else if (helpfulMatch) {
                helpful = helpfulMatch[1];
            }

            // Extraire les valeurs "amusantes"
            let funnyMatch = htmlContent.match(/(\d+) personne(?:s ont| a) trouvé cette évaluation amusante/);
            if (!funnyMatch && /Personne n'a trouvé cette évaluation amusante/.test(htmlContent)) {
                funny = '0';
            } else if (funnyMatch) {
                funny = funnyMatch[1];
            }
        }

        const rewardsElement = review.querySelector('.review_award_aggregated');
        const rewards = rewardsElement ? rewardsElement.textContent.trim() : '0';


        csvContent += `"${recommended}";"${helpful}";"${funny}";"${hours.replace('h en tout', '').trim()}";"${datePosted.replace('Évaluation publiée le', '').trim()}";"${comment.replace(/(\r\n|\n|\r)/gm, " ").replace(/"/g, '""')}";"${productsRegistered.replace(/(\r\n|\n|\r)/gm, " ").replace(/"/g, '""')}";"${earlyAccessReview}";"${refunded}";"${receivedCompensation}";"${rewards}"\n`;
    });

    // Écrire le résultat dans un fichier CSV
    fs.writeFile('steam_reviews.csv', csvContent, err => {
        if (err) {
            console.error("Erreur lors de l'écriture du fichier CSV :", err);
            return;
        }
        console.log('Fichier CSV créé avec succès.');
    });
});
