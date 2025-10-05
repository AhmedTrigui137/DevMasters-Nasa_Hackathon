## 🚀 Aperçu

Cosmic Health Navigator est une plateforme de surveillance environnementale avancée qui combine la visualisation de données en temps réel avec une interface utilisateur 3D époustouflante. L'application permet aux utilisateurs de surveiller les conditions environnementales et d'évaluer les risques pour la santé respiratoire à travers une expérience immersive sur le thème spatial.

### ✨ Fonctionnalités principales

- **🌍 Carte interactive** avec heatmap en temps réel
- **🎯 Filtres personnalisés** par groupe d'âge et sévérité de l'asthme
- **📊 Visualisation des données** environnementales avancée
- **🌌 Interface 3D** avec arrière-plan spatial animé
- **📱 Design responsive** optimisé pour tous les appareils
- **⚡ Performance optimisée** avec animations fluides

## 🛠️ Technologies utilisées

### Frontend Core
- **React 18.3.1** - Bibliothèque UI moderne
- **TypeScript 5.5.3** - Typage statique
- **Vite 5.4.2** - Build tool ultra-rapide
- **Tailwind CSS 3.4.1** - Framework CSS utilitaire

### Visualisation 3D
- **Three.js** - Moteur 3D WebGL
- **@react-three/fiber** - Intégration React pour Three.js
- **@react-three/drei** - Helpers et composants 3D

### Cartographie
- **React Leaflet** - Cartes interactives
- **Leaflet.heat** - Plugin heatmap
- **Leaflet** - Bibliothèque de cartes open source

### Animations
- **Framer Motion 12.23.22** - Animations et transitions
- **Lucide React** - Icônes modernes

## Backend / Database

- The backend is a FastAPI app in `backend/`. It supports Postgres (Supabase) via the `DATABASE_URL` env var.
- Copy `.env.example` to `.env` and set `DATABASE_URL` (for Supabase use the provided connection string in your Supabase project).
- For local development you can run a Postgres container (see `docker-compose.yml`) or point `DATABASE_URL` to your Supabase DB.

Migrations
---------

Alembic is included in `backend/requirements.txt`. A minimal `backend/alembic` scaffold exists; you should update `backend/alembic/env.py` to match your setup, then run:

```bash
cd backend
pip install -r requirements.txt
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

If you want me to fully scaffold Alembic for async SQLModel + asyncpg, I can add the complete config and initial migration.
