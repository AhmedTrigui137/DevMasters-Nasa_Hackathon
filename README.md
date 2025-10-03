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

## ☁️ Infrastructure Overview

Cosmic Health Navigator relies on a robust **AWS Cloud architecture** to ensure scalability, reliability, and real-time performance. The infrastructure processes environmental data from multiple sources, transforms it into valuable insights, and makes it available through APIs and an interactive frontend.

### 🔗 Source Data

*   **NASA** – Earth observation data
    
*   **NASA FIRMS** – Fire Information for Resource Management System
    
*   **USGS Landsat** – Satellite imagery
    
*   **NOAA** – Weather and atmospheric data
    

### 🗄️ Store, Ingest and Backup

*   **Amazon S3 Data Lake** – Central storage for raw and processed data
    
*   **Amazon Kinesis Data Streams** – Real-time data ingestion
    
*   **AWS Lambda (Custom Code)** – Serverless data transformation
    
*   **AWS Glue** – Managed ETL service for structured transformations
    

### 📊 Value Layer

*   **Amazon Athena** – Interactive SQL queries on S3
    
*   **Amazon Redshift** – Scalable data warehouse
    
*   **Amazon SageMaker** – Machine Learning model training and deployment
    

### 📡 Monitoring

*   **Amazon CloudWatch** – Metrics and logs monitoring
    
*   **Amazon SNS** – Notifications and alerts
    
*   **Amazon EventBridge** – Event-driven integration
    

### ⚙️ API Layer

*   **Amazon API Gateway** – Secure API exposure
    
*   **AWS AppSync** – Managed GraphQL API for real-time data
    
*   **AWS Lambda** – Backend logic execution
    
*   **AWS Cognito** – Authentication and user management
    
*   **Amazon DynamoDB** – Fast and scalable NoSQL database