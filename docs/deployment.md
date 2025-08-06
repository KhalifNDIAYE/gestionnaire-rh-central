# Guide de Déploiement

## Vue d'ensemble

Ce projet utilise un pipeline de déploiement automatisé basé sur GitHub Actions avec support pour plusieurs environnements et rollback automatique.

## Environnements

### 🔧 Développement (develop)
- **Branche**: `develop`
- **URL**: `https://dev.yourapp.com`
- **Déploiement**: Automatique lors du push
- **Tests**: Tests unitaires + E2E

### 🚦 Staging (staging)
- **Branche**: `staging`
- **URL**: `https://staging.yourapp.com`
- **Déploiement**: Automatique après tests
- **Tests**: Suite complète + smoke tests

### 🚀 Production (main)
- **Branche**: `main`
- **URL**: `https://yourapp.com`
- **Déploiement**: Automatique avec approbation
- **Tests**: Suite complète + health checks

## Pipeline de Déploiement

### 1. Tests Automatisés
```yaml
- Linting et type checking
- Tests unitaires avec couverture
- Tests E2E avec Playwright
- Tests d'accessibilité
- Analyse SonarCloud
```

### 2. Build Multi-Environnements
```yaml
- Build optimisé par environnement
- Variables d'environnement spécifiques
- Artefacts versionnés
- Cache intelligent
```

### 3. Déploiement Progressif
```yaml
- Staging automatique
- Tests de fumée
- Production avec approbation
- Health checks post-déploiement
```

### 4. Rollback Automatique
```yaml
- Backup avant déploiement
- Health checks automatiques
- Rollback sur échec
- Notifications d'alerte
```

## Commandes de Déploiement

### Déploiement Standard
```bash
# Push vers develop pour déployer en staging
git push origin develop

# Push vers main pour déployer en production
git push origin main
```

### Déploiement Manuel
```bash
# Déclencher un déploiement via GitHub Actions
gh workflow run ci-cd.yml -f environment=staging
```

### Rollback d'Urgence
```bash
# Rollback manuel via GitHub Actions
gh workflow run ci-cd.yml -f environment=production --rollback
```

### Hotfixes
```bash
# Créer une branche de hotfix
git checkout -b hotfix/fix-critical-bug

# Déploiement d'urgence (bypass staging)
git push origin hotfix/emergency
```

## Configuration des Secrets

### GitHub Secrets Requis
```yaml
# Vercel/Déploiement
VERCEL_TOKEN: "xxx"
VERCEL_ORG_ID: "xxx"
VERCEL_PROJECT_ID: "xxx"

# Monitoring
SENTRY_AUTH_TOKEN: "xxx"
CODECOV_TOKEN: "xxx"
SONAR_TOKEN: "xxx"

# Webhooks
BACKUP_WEBHOOK_URL: "xxx"
ROLLBACK_WEBHOOK_URL: "xxx"
MONITORING_WEBHOOK_URL: "xxx"
SLACK_WEBHOOK: "xxx"

# Tokens d'authentification
BACKUP_TOKEN: "xxx"
ROLLBACK_TOKEN: "xxx"
MONITORING_TOKEN: "xxx"
```

### Configuration par Environnement
```yaml
# Development
VITE_ENVIRONMENT: "development"
VITE_API_URL: "https://dev-api.yourapp.com"

# Staging
VITE_ENVIRONMENT: "staging"
VITE_API_URL: "https://staging-api.yourapp.com"

# Production
VITE_ENVIRONMENT: "production"
VITE_API_URL: "https://api.yourapp.com"
```

## Monitoring et Alertes

### Health Checks Automatiques
- Tests de santé toutes les 5 minutes
- Métriques de performance
- Surveillance des erreurs
- Alertes Slack automatiques

### Métriques Surveillées
- Temps de réponse API
- Taux d'erreur
- Utilisation CPU/Mémoire
- Disponibilité du service

### Alertes Configurées
- Échec de déploiement
- Health checks en échec
- Performance dégradée
- Erreurs critiques

## Processus de Release

### 1. Préparation
```bash
# Créer une branche de release
git checkout -b release/v1.2.0

# Mettre à jour le changelog
npm run changelog:generate

# Bump version
npm version minor
```

### 2. Tests et Validation
```bash
# Tests complets
npm run test:unit
npm run test:e2e
npm run test:accessibility

# Build de validation
npm run build:production
```

### 3. Merge et Tag
```bash
# Merge vers main
git checkout main
git merge release/v1.2.0

# Tag et push
git tag v1.2.0
git push origin main --tags
```

### 4. Déploiement Automatique
- GitHub Actions détecte le tag
- Déploiement automatique en production
- Création de la release GitHub
- Notifications des équipes

## Troubleshooting

### Échec de Déploiement
1. Vérifier les logs GitHub Actions
2. Contrôler les health checks
3. Examiner les métriques Sentry
4. Rollback si nécessaire

### Performance Dégradée
1. Analyser les métriques
2. Vérifier la charge serveur
3. Optimiser si nécessaire
4. Déployer les corrections

### Rollback Procedure
1. Identifier la version stable précédente
2. Déclencher le rollback automatique
3. Vérifier la restauration
4. Investiguer la cause racine

## Bonnes Pratiques

### Avant le Déploiement
- ✅ Tests locaux passants
- ✅ Code review approuvé
- ✅ Changelog mis à jour
- ✅ Breaking changes documentés

### Pendant le Déploiement
- 👁️ Surveiller les logs
- 📊 Monitorer les métriques
- 🔔 Rester disponible pour intervention
- 📱 Notifications activées

### Après le Déploiement
- ✅ Vérifier les health checks
- 📈 Analyser les métriques
- 🐛 Surveiller les erreurs
- 📝 Documenter les changements

## Support et Contact

- **Équipe DevOps**: devops@yourcompany.com
- **Alertes**: #alerts (Slack)
- **Status Page**: https://status.yourapp.com
- **Documentation**: https://docs.yourapp.com