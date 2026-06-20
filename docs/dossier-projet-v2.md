# Dossier Projet — MKD CaisseConnect (V2)

*Titre Professionnel Concepteur Développeur d'Applications — Session 2026*
*Candidate : Myriam DUVENTRU*

---

## Sommaire

1. Présentation du projet et contexte
2. Enjeux et objectifs
3. Architecture générale du produit
4. Choix techniques et justifications
5. Modélisation des données
6. Sécurité et conformité RGPD
7. Accessibilité (WCAG)
8. Intégration des paiements (Stripe)
9. Conformité facturation électronique
10. Plan de tests
11. Intégration continue et déploiement
12. Éco-conception
13. Gestion de projet
14. Annexes techniques
15. Synthèse en anglais

---

## 1. Présentation du projet et contexte

### 1.1 Origine du projet

CaisseMobile a été conçu durant un stage chez AMI 3D, agence de modélisation et d'impression 3D dirigée par Nathalie, pour répondre à un besoin concret d'encaissement mobile lors de marchés et salons. Ce premier projet a permis de poser une architecture technique solide (Laravel 11, Inertia, React, mode offline-first) et de valider un usage réel du produit sur le terrain.

À l'issue du stage, la candidate a fait le choix de transformer cette expérience en produit commercial autonome, MKD CaisseConnect, destiné à être proposé à plusieurs commerçants indépendants au-delà du client initial. Ce repositionnement a nécessité de clarifier la situation de propriété intellectuelle du code produit en stage : après consultation de professionnels, il a été décidé de réécrire intégralement le projet sur une base de code nouvelle, dans un dépôt distinct, plutôt que de réutiliser le code source d'origine — démarche documentée en section 1.3.

### 1.2 Présentation de MKD CaisseConnect V2

MKD CaisseConnect est une application de caisse mobile destinée aux commerçants indépendants (TPE), commercialisée sous forme d'abonnement (location du service, incluant maintenance et support). Contrairement à la version initiale conçue pour un unique client, la V2 est pensée dès la conception comme un produit générique et configurable : chaque client peut adapter le catalogue, les moyens de paiement et le profil de facturation à son activité (vente de produits, prestations de services, profil de clientèle B2C, B2B, ou mixte).

### 1.3 Démarche de sécurisation de la propriété intellectuelle

Le code source de la version initiale (CaisseMobile) ayant été produit dans le cadre d'un stage en entreprise, sa réutilisation à des fins commerciales personnelles soulevait une question de propriété intellectuelle : en droit français, les développements réalisés en stage appartiennent en général à la structure d'accueil, sauf disposition contraire.

Cette question a été traitée en amont du développement de la V2, par la consultation de professionnels compétents en la matière. La décision retenue a été la suivante :

- Réécriture intégrale du code applicatif, sans reprise d'aucune ligne du dépôt original ;
- Conservation possible de l'expérience fonctionnelle acquise (schéma de données, choix d'architecture, retours d'usage terrain) à titre de connaissance, et non de code ;
- Création d'un nouveau dépôt Git (`MyriamD-ops/MKD-CaisseConnect`), avec un historique source propre, distinct du dépôt client d'origine ;
- Choix d'un nom de marque et d'une identité visuelle propres, sans lien avec la dénomination du client initial.

Cette démarche, bien qu'extérieure au périmètre strictement technique du développement, est documentée ici car elle a conditionné l'ensemble des choix de conception qui suivent, notamment l'architecture générique et configurable décrite en section 3.

## 2. Enjeux et objectifs

### 2.1 Enjeux métier

Le marché des TPE françaises fait face à une double échéance réglementaire qui constitue l'un des principaux moteurs commerciaux du projet : la généralisation de la facturation électronique entre professionnels (obligation de réception pour toutes les entreprises assujetties à la TVA dès le 1er septembre 2026, obligation d'émission étendue aux PME/TPE au 1er septembre 2027), et l'obligation d'e-reporting pour les transactions B2C. Un outil de caisse intégrant nativement cette conformité représente un avantage concurrentiel significatif face aux solutions existantes qui ne l'anticipent pas encore.

### 2.2 Objectifs du projet

- Transformer une application développée pour un client unique en un produit commercialisable auprès de plusieurs clients indépendants ;
- Garantir une architecture générique et configurable, sans logique métier codée en dur pour un commerce particulier ;
- Intégrer un système de paiement multi-moyens (carte, Apple Pay, Google Pay, virement SEPA) via Stripe ;
- Assurer la conformité à la réforme de la facturation électronique française, en distinguant les flux B2C (e-reporting) et B2B (facturation structurée via plateforme agréée) ;
- Déployer une infrastructure cloud moderne, conforme aux exigences de localisation des données en Union européenne ;
- Documenter l'ensemble de la démarche dans le cadre de la certification Titre Professionnel Concepteur Développeur d'Applications.

### 2.3 Modèle de déploiement retenu

Après analyse comparative entre une architecture SaaS mutualisée (multi-tenant) et une architecture à instance dédiée par client, le second modèle a été retenu pour cette V2. Ce choix répond à un double objectif de simplicité technique et juridique : chaque client dispose de sa propre instance applicative, de ses propres clés de paiement Stripe, et de sa propre connexion à une plateforme agréée de facturation électronique, évitant ainsi la complexité d'isolation des données et de gestion des paiements (Stripe Connect) inhérente à une architecture mutualisée. Cette décision pourra être réévaluée à plus long terme si le nombre de clients actifs rend la maintenance par instance moins efficiente qu'une mutualisation.

## 3. Architecture générale du produit

### 3.1 Principe de conception : un produit, configurable plutôt que dupliqué

Le principal écueil identifié pour un projet destiné à plusieurs clients aurait été de dupliquer le code à chaque nouveau commerçant ("un fork par client"). Cette approche, bien que séduisante en apparence pour répondre rapidement à des besoins spécifiques, devient rapidement ingérable à l'échelle : un correctif découvert chez un client doit être reporté manuellement sur toutes les autres copies, et les évolutions divergent progressivement d'une instance à l'autre.

L'architecture retenue repose donc sur un principe unique : un seul code source, déployé en plusieurs instances indépendantes (une par client), dans lequel les besoins spécifiques à chaque commerce sont gérés par de la **configuration** plutôt que par du code dupliqué. Concrètement :

| Spécificité métier identifiée sur la V1 | Traitement en V2 |
|---|---|
| Catalogue produit avec champ "matière" fixe (atelier d'impression 3D) | Système de champs personnalisés par instance, adaptable à tout type de commerce |
| Message de reçu SMS codé en dur (texte et enseigne du client initial) | Modèle de message configurable par instance (nom commercial, mentions légales) |
| Liste de moyens de paiement fixe | Liste configurable par instance, extensible (ajout de Stripe, SEPA, etc.) |
| Module "Événements / marchés" | Conservé comme module activable ou non selon le profil du commerçant |

### 3.2 Modèle de déploiement par instance

Chaque client dispose d'une instance applicative indépendante, hébergée sur Laravel Cloud, avec sa propre base de données, ses propres identifiants de paiement et sa propre configuration de facturation électronique. L'onboarding d'un nouveau client consiste à provisionner une nouvelle instance à partir du code source commun, puis à la paramétrer selon l'activité du commerçant (étape détaillée en section 11).

