# 🌿 VerDeNovo

Aplicativo mobile de conscientização ambiental que ajuda usuários a encontrar pontos de coleta seletiva próximos e aprender a descartar resíduos corretamente.

---

## 📱 Sobre o App

O **VerDeNovo** conecta pessoas a pontos de coleta de resíduos nas cidades de **Barueri** e **Itapevi** (SP), oferecendo:

- Mapa interativo com pontos de coleta categorizados
- Guia completo de reciclagem por tipo de material
- Dicas rápidas de descarte consciente
- Detecção de localização para encontrar o ponto mais próximo
- Design no estilo **Claymorphism** com paleta verde

---

## 🚀 Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Aplicativo **Expo Go** no celular (iOS ou Android) — ou emulador configurado

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/verdenovomobile.git

# Entre na pasta do projeto
cd verdenovomobile/verdenovo

# Instale as dependências
npm install
```

### Executando

```bash
# Inicia o servidor de desenvolvimento
npm start
# ou
npx expo start
```

Após iniciar, escaneie o QR Code com o **Expo Go** (Android) ou com a câmera (iOS).

### Plataformas específicas

```bash
npm run android   # Abre no emulador Android
npm run ios       # Abre no simulador iOS (requer macOS)
npm run web       # Abre no navegador
```

---

## 🗂️ Estrutura do Projeto

```
verdenovo/
├── assets/
│   ├── Verdenovologo.png
│   ├── icon.png
│   ├── splash-icon.png
│   └── adaptive-icon.png
├── src/
│   ├── components/
│   │   └── DrawerMenu.js       # Menu lateral (Drawer)
│   ├── screens/
│   │   ├── SplashScreen.js     # Tela de entrada
│   │   ├── HomeScreen.js       # Tela inicial
│   │   ├── MapaScreen.js       # Mapa de pontos de coleta
│   │   ├── DicasScreen.js      # Guia de reciclagem
│   │   └── SobreScreen.js      # Sobre o VerDeNovo
│   └── theme.js                # Paleta de cores global
├── App.js                      # Navegação principal
├── app.json                    # Configurações Expo
└── package.json
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|---|---|---|
| [React Native](https://reactnative.dev/) | 0.81.5 | Framework principal |
| [Expo](https://expo.dev/) | ~54.0.33 | Plataforma de desenvolvimento |
| [React](https://react.dev/) | 19.1.0 | Biblioteca de UI |
| [@react-navigation/native](https://reactnavigation.org/) | ^7.2.2 | Navegação entre telas |
| [@react-navigation/native-stack](https://reactnavigation.org/) | ^7.14.11 | Navegação em pilha (Splash → Main) |
| [@react-navigation/drawer](https://reactnavigation.org/) | ^7.9.8 | Menu lateral (Drawer) |
| [react-native-maps](https://github.com/react-native-maps/react-native-maps) | 1.20.1 | Mapa interativo com marcadores |
| [expo-location](https://docs.expo.dev/sdk/location/) | ~19.0.8 | Geolocalização do usuário |
| [@expo/vector-icons](https://icons.expo.fyi/) | ^15.1.1 | Ícones (Ionicons) |
| [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/) | ~2.28.0 | Gestos para o Drawer |
| [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) | ~4.1.1 | Animações avançadas |
| [react-native-screens](https://github.com/software-mansion/react-native-screens) | ~4.16.0 | Otimização de telas nativas |
| [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context) | ~5.6.0 | Área segura em notch/ilha dinâmica |
| [expo-status-bar](https://docs.expo.dev/versions/latest/sdk/status-bar/) | ~3.0.9 | Controle da barra de status |
| [expo-font](https://docs.expo.dev/versions/latest/sdk/font/) | ~14.0.11 | Carregamento de fontes |

---

## 🎨 Design

O app utiliza o estilo **Claymorphism**, caracterizado por:

- Bordas muito arredondadas (`borderRadius` entre 24–40px)
- Sombras coloridas temáticas (não pretas)
- Superfícies com bordas claras simulando profundidade
- Elementos "inflados" com padding generoso
- Blobs decorativos nos headers
- Fundo geral em verde suave (`#EAF4EC`)

### Paleta de Cores

| Token | Cor | Uso |
|---|---|---|
| `primary` | `#209948` | Verde principal — botões, headers |
| `primaryDark` | `#177a39` | Verde escuro — sombras, textos ativos |
| `primaryLight` | `#D2EFD9` | Verde claro — fundos de cards |
| `primaryMid` | `#8ECFA0` | Verde médio — ícones ativos |
| `accent` | `#3498DB` | Azul — destaque eletrônicos |
| `danger` | `#E74C3C` | Vermelho — alertas, resíduos perigosos |
| `warning` | `#F1C40F` | Amarelo — avisos |
| `text` | `#2C3E50` | Texto principal |
| `textLight` | `#7F8C8D` | Texto secundário |

---

## 📍 Pontos de Coleta

O app cobre **12 pontos de coleta** nas categorias:

- ♻️ **Geral** — Ecopontos municipais
- 📰 **Papel e Plástico** — Coleta seletiva
- 💻 **Eletrônicos** — Descarte de e-lixo
- 🔋 **Pilhas e Baterias** — Coleta específica
- 💊 **Medicamentos** — Farmácias e postos

---

## 📋 Permissões Necessárias

| Permissão | Plataforma | Motivo |
|---|---|---|
| `ACCESS_FINE_LOCATION` | Android | Localização precisa para pontos próximos |
| `ACCESS_COARSE_LOCATION` | Android | Localização aproximada |
| `NSLocationWhenInUseUsageDescription` | iOS | Localização durante uso do app |

---

## 👥 Equipe

Desenvolvido com 💚 pela equipe **VerDeNovo**.

> *"Descarte certo. Planeta melhor."*
