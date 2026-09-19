# ADBot — Active Directory Automation

> 🇫🇷 [Version française](#-version-française) | 🇬🇧 [English version](#-english-version)

---

## 🇬🇧 English Version

Project developed during my **1st year internship of the Computer Engineering cycle** at **Intercom Technologies**.

### Description

ADBot is a full-stack web application designed to automate the management of Active Directory (users, groups, computers, organizational units) with Windows Server via WinRM (Windows Remote Management).

It allows system administrators to manage their Active Directory infrastructure from an intuitive web interface, without having to connect directly to the Windows server.

### Features

- **AD User management**: create, update, enable/disable, delete
- **Group management**: create, add/remove members, delete
- **Computer management**: view, enable/disable, delete
- **Organizational Unit (OU) management**: create, view, delete
- **Connection test**: verify WinRM connectivity with the AD server
- **Responsive interface** with light/dark theme

### Architecture

```
ADBot/
├── adbot_fastapi/       # Python backend (FastAPI + WinRM)
│   └── app/
│       ├── core/        # Configuration and PowerShell/WinRM client
│       ├── models/      # Pydantic schemas
│       └── routers/     # REST endpoints (users, groups, computers, OUs)
└── adbot_frontend/      # Angular 20 + PrimeNG frontend
    └── src/
        └── app/
            └── components/  # Dashboard, lists, header
```

### Tech Stack

| Layer     | Technology                           |
|-----------|--------------------------------------|
| Backend   | Python 3.13 · FastAPI · WinRM        |
| Frontend  | Angular 20 · PrimeNG · TypeScript    |
| Protocol  | WinRM / Remote PowerShell            |
| Target    | Windows Server + Active Directory    |

### Prerequisites

- Python 3.10+
- Node.js 18+
- A Windows Server with WinRM enabled and Active Directory configured

### Installation & Setup

#### Backend

```bash
cd adbot_fastapi
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Create a `.env` file at the root:

```env
WINRM_SERVER=<SERVER_IP>
WINRM_USERNAME=<USERNAME>
WINRM_PASSWORD=<PASSWORD>
```

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend

```bash
cd adbot_frontend
npm install
npm start
```

App available at `http://localhost:4200`  
API documented at `http://localhost:8000/docs`

---

## 🇫🇷 Version Française

Projet réalisé dans le cadre de mon **stage de 1ère année du cycle ingénierie informatique** au sein d'**Intercom Technologies**.

### Description

ADBot est une application web full-stack ayant pour but l'automatisation de la gestion de l'Active Directory (utilisateurs, groupes, ordinateurs, unités d'organisation) avec Windows Server via WinRM (Windows Remote Management).

Elle permet aux administrateurs système de gérer leur infrastructure Active Directory depuis une interface web intuitive, sans avoir à se connecter directement au serveur Windows.

### Fonctionnalités

- **Gestion des utilisateurs AD** : création, modification, activation/désactivation, suppression
- **Gestion des groupes** : création, ajout/suppression de membres, suppression
- **Gestion des ordinateurs** : consultation, activation/désactivation, suppression
- **Gestion des unités d'organisation (OUs)** : création, consultation, suppression
- **Test de connexion** : vérification de la connectivité WinRM avec le serveur AD
- **Interface responsive** avec thème clair/sombre

### Architecture

```
ADBot/
├── adbot_fastapi/       # Backend Python (FastAPI + WinRM)
│   └── app/
│       ├── core/        # Configuration et client PowerShell/WinRM
│       ├── models/      # Schémas Pydantic
│       └── routers/     # Endpoints REST (users, groups, computers, OUs)
└── adbot_frontend/      # Frontend Angular 20 + PrimeNG
    └── src/
        └── app/
            └── components/  # Dashboard, listes, header
```

### Stack technique

| Couche     | Technologie                          |
|------------|--------------------------------------|
| Backend    | Python 3.13 · FastAPI · WinRM        |
| Frontend   | Angular 20 · PrimeNG · TypeScript    |
| Protocole  | WinRM / PowerShell distant           |
| Cible      | Windows Server + Active Directory    |

### Prérequis

- Python 3.10+
- Node.js 18+
- Un serveur Windows avec WinRM activé et Active Directory configuré

### Installation & lancement

#### Backend

```bash
cd adbot_fastapi
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Créer un fichier `.env` à la racine :

```env
WINRM_SERVER=<IP_DU_SERVEUR>
WINRM_USERNAME=<UTILISATEUR>
WINRM_PASSWORD=<MOT_DE_PASSE>
```

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend

```bash
cd adbot_frontend
npm install
npm start
```

L'application est accessible sur `http://localhost:4200`  
L'API est documentée sur `http://localhost:8000/docs`
