import db from '../db';
import axios from 'axios';

/**
 * Synchronise les produits depuis le serveur vers IndexedDB
 */
export async function syncProduits() {
    try {
        console.log('🔄 Synchronisation produits...');
        
        const response = await axios.get('/api/products');
        const produits = response.data;
        
        await db.produits.clear();
        await db.produits.bulkAdd(produits);
        
        console.log(`✅ ${produits.length} produits synchronisés`);
        return produits;
    } catch (error) {
        console.error('❌ Erreur sync produits:', error);
        throw error;
    }
}

/**
 * Récupère les produits depuis IndexedDB
 */
export async function getProduitsLocal() {
    try {
        const produits = await db.produits.toArray();
        console.log(`📦 ${produits.length} produits chargés depuis IndexedDB`);
        return produits;
    } catch (error) {
        console.error('❌ Erreur lecture IndexedDB:', error);
        return [];
    }
}

/**
 * Synchronise les événements depuis le serveur vers IndexedDB
 */
export async function syncEvenements() {
    try {
        console.log('🔄 Synchronisation événements...');
        
        const response = await axios.get('/api/events');
        const evenements = response.data;
        
        await db.evenements.clear();
        await db.evenements.bulkAdd(evenements);
        
        console.log(`✅ ${evenements.length} événements synchronisés`);
        return evenements;
    } catch (error) {
        console.error('❌ Erreur sync événements:', error);
        throw error;
    }
}

/**
 * Récupère les événements depuis IndexedDB
 */
export async function getEvenementsLocal() {
    try {
        const evenements = await db.evenements.toArray();
        console.log(`📦 ${evenements.length} événements chargés depuis IndexedDB`);
        return evenements;
    } catch (error) {
        console.error('❌ Erreur lecture IndexedDB:', error);
        return [];
    }
}

/**
 * Sauvegarde une vente en local (offline)
 */
export async function saveVenteLocal(venteData) {
    try {
        console.log('💾 Sauvegarde vente locale...');
        
        // Ajouter à la queue des ventes non synchronisées
        const venteId = await db.ventes_queue.add({
            ...venteData,
            synced: false,
            created_at: new Date().toISOString()
        });
        
        console.log(`✅ Vente sauvegardée localement (ID: ${venteId})`);
        return venteId;
    } catch (error) {
        console.error('❌ Erreur sauvegarde vente locale:', error);
        throw error;
    }
}

/**
 * Récupère toutes les ventes non synchronisées
 */
export async function getVentesNonSync() {
    try {
        // Utiliser toArray() puis filter au lieu de where() car synced n'est pas indexé
        const allVentes = await db.ventes_queue.toArray();
        const ventes = allVentes.filter(v => v.synced === false);
        
        console.log(`📦 ${ventes.length} ventes non synchronisées`);
        return ventes;
    } catch (error) {
        console.error('❌ Erreur lecture ventes non sync:', error);
        return [];
    }
}

/**
 * Synchronise les ventes en attente vers le serveur
 */
export async function syncVentes() {
    try {
        const ventesNonSync = await getVentesNonSync();
        
        if (ventesNonSync.length === 0) {
            console.log('✅ Aucune vente à synchroniser');
            return 0;
        }
        
        console.log(`🔄 Synchronisation de ${ventesNonSync.length} vente(s)...`);
        
        let syncCount = 0;
        
        for (const vente of ventesNonSync) {
            try {
                // Transformer les articles au format attendu par le serveur
                const items = vente.articles.map(article => ({
                    id_produit: article.id_produit,
                    quantite: article.quantite,
                    prix_unitaire: article.prix_unitaire
                }));

                // Envoyer la vente au serveur
                await axios.post('/sales', {
                    items: items,
                    moyen_paiement: vente.mode_paiement
                });
                
                // Marquer comme synchronisée
                await db.ventes_queue.update(vente.id, { synced: true });
                
                syncCount++;
                console.log(`✅ Vente ${vente.id} synchronisée`);
            } catch (error) {
                console.error(`❌ Erreur sync vente ${vente.id}:`, error);
                console.error('Détails:', error.response?.data);
            }
        }
        
        console.log(`✅ ${syncCount}/${ventesNonSync.length} ventes synchronisées`);
        return syncCount;
    } catch (error) {
        console.error('❌ Erreur synchronisation ventes:', error);
        return 0;
    }
}
