import Dexie from 'dexie';

// Créer la base de données IndexedDB
const db = new Dexie('MKDCaisseConnectDB');

// Définir le schéma (version 1)
db.version(1).stores({
    // Table produits - clé primaire : id_produit
    produits: 'id_produit, nom, prix_base, stock_actuel, categorie, matiere, actif',
    
    // Table événements - clé primaire : id_evenement
    evenements: 'id_evenement, nom, code_unique, date_debut, date_fin, statut',
    
    // Table ventes en attente de synchronisation - clé auto-incrémentée
    ventes_queue: '++id, numero_vente, montant_total, date_vente, synced, id_utilisateur',
    
    // Table pour stocker les lignes de vente
    lignes_vente_queue: '++id, vente_queue_id, id_produit, nom_produit, quantite, prix_unitaire, sous_total',
    
    // Table pour stocker la date de dernière synchronisation
    sync_meta: 'key, last_sync, status'
});

// Événement d'ouverture
db.on('ready', () => {
    console.log('💾 IndexedDB prête : MKDCaisseConnectDB');
});

// Gestion des erreurs
db.on('versionchange', () => {
    console.log('⚠️ Une autre version de la base est ouverte');
});

export default db;
