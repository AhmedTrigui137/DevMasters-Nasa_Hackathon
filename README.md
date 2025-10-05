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

##☁️ **Infrastructure Overview**
------------------------------

This architecture showcases a complete Azure-based data processing and analytics pipeline designed to collect, store, transform, analyze, and serve environmental data from multiple scientific sources.

### **🔹 Source Data**

The system ingests raw data from trusted environmental and scientific organizations such as:

*   **NASA**
    
*   **NASA FIRMS**
    
*   **USGS Landsat**
    
*   **NOAA**
    

### **🔹 Store, Ingest, and Backup**

All incoming data is centralized in **Azure Data Lake**, serving as the core data repository.Data transformation and orchestration are performed using:

*   **Azure Data Factory** : for data ingestion and pipeline automation
    
*   **Azure Functions** : for event-driven data processing
    
*   **Azure Event Hub** : for real-time data streaming and event handling
    

Processed and refined data is then stored and made available for advanced analytics.

### **🔹 Value Layer**

The processed data is analyzed and enriched using:

*   **Azure Synapse Analytics** : for data warehousing and big data analytics
    
*   **Synapse SQL Serverless Pool** : for on-demand querying
    
*   **Azure Machine Learning Service** : for building predictive and analytical models
    

### **🔹 Monitoring**

System health, performance, and event tracking are maintained through:

*   **Azure Monitor** : for real-time monitoring and alerting
    
*   **Azure Notification Hub** : for sending alerts and notifications
    
*   **Azure Event Grid** : for event-based automation and integration
    

### **🔹 API Layer**

Data and analytics results are exposed securely via:

*   **Azure API Management** : for managing and publishing APIs
    
*   **Azure Functions** : for custom logic and serverless API execution
    
*   **Azure Active Directory B2C** : for secure user authentication
    
*   **Azure Cosmos DB** : for scalable, globally distributed data storage
    

### **🔹 Application Layer**

Finally, **Azure App Services** hosts the end-user applications that consume and visualize the processed data through APIs, providing a seamless and scalable user experience.
