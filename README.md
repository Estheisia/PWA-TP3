# PWA - TP3 - Todolist Angular Huyghe Rémi

## Installation

1. Ouvrir un invite de commande dans le dossier où vous voulez avoir le dossier du projet :
    git clone https://github.com/Estheisia/PWA-TP3
2. Aller dans le dossier :
    cd PWA-TP3
3. Mettre en service le projet :
    npm install
4. Lancer le serveur pour afficher la page :
    ng serve
5. Aller sur la page :
    http://localhost:4200

## Fonctionnalités

- TP3
- Supprimer cochés
- Undo / Redo
- Sauvegarde local
- Effacer tout

## Détails

### TP3

Gestion des filtres des items, édition des items.

### Supprimer cochés

Supprime tous les items cochés.

### Undo / Redo

Permet d'annuler et de refaire les actions dans la liste.
Les boutons sont désactivés lorsque leur utilisation est logiquement impossible.

### Sauvegarde local

La liste est stockée localement dans un JSON, qui permet d'avoir une trace en cas de déconnexion.
Un bouton permet de supprimer la liste sauvegardée, il suffit de recharger la page pour vérifier.

### Effacer tout

Le bouton supprime la liste dans son intégralité.
