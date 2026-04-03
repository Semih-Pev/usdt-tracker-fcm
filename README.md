# USDT Whale Tracker (Ethereum Mainnet -> Firebase FCM)

Bu proje, Ethereum ana ağında (Mainnet) gerçekleşen 100.000 USDT ve üzeri "Whale" transferlerini gerçek zamanlı olarak dinleyerek analiz eder ve yakaladığı transfer verisini Firebase Cloud Messaging (FCM) altyapısını kullanarak anlık bildirim (Push Notification) formatında web istemcisine (Next.js) gönderir.

Proje, **NestJS** temelli bir backend ve **Next.js** temelli Tailwind CSS ile tasarlanmış modern bir frontend olmak üzere iki ana bileşenden oluşmaktadır.

---

## 🏗 Klasör Yapısı

- `/backend`: NestJS uygulaması (WSS üzerinden Ethers.js çalıştırır, FCM Admin kullanarak bildirim fırlatır.)
- `/frontend`: Next.js uygulaması (FCM Client ile register olur, bildirim mesajını alıp ekrana şık bir şekilde yansıtır.)

---

## 🛠 Kullanılan teknolojiler

- **Backend**: NestJS, ethers.js, firebase-admin
- **Frontend**: Next.js (App Router), React, Firebase JS SDK, Tailwind CSS, lucide-react
- **Network**: Ethereum Mainnet
- **Smart Contract**: USDT (Tether) `0xdAC17F958D2ee523a2206206994597C13D831ec7`

---

## 🚀 Kurulum adımları

### 1- Firebase ve Çevre Değişkenleri Hazırlığı

Öncelikle bir Firebase projesi yaratmanız gerekir:
1. Firebase Console (https://console.firebase.google.com/) üzerinden yeni bir proje oluşturun.
2. Servis Hesabı oluşturup (**Project Settings -> Service Accounts**) JSON türünde özel anahtarı indirin.
3. Bir Web Uygulaması (**Project Settings -> General -> Your apps**) oluşturarak uygulama konfigürasyonunu kopyalayın.

### 2- Backend Kurulumu

Terminalde `/backend` dizinine gidin ve bağımlılıkları yükleyin:
```bash
cd backend
npm install
```

`backend` dizini içinde bir `.env` dosyası oluşturun ve aşağıdaki değerleri kendi yapılandırmanız ile değiştirin:
```env
# Ethereum RPC - Kendi Alchemy veya Infura WSS/HTTP bağlantınız (Örn: wss://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY)
# Boş bırakırsanız Cloudflare HTTP node kullanılır (Yavaş olabilir/Rate limit olabilir)
RPC_URL=https://cloudflare-eth.com

# Indirdiğiniz Servis Hesabı JSON içerisinden bilgileri kopyalayın. 
# PRIVATE_KEY içerisindeki "----BEGIN PRIVATE KEY----" vb string formatını tek parça olarak ("\n") yapıştırabilirsiniz.
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIC....\n-----END PRIVATE KEY-----\n"

# Backend varsayılan olarak 3001 portunda çalışacaktır (Frontend 3000'i kullanacak)
PORT=3001
```

Ardından Backend'i çalıştırın:
```bash
npm run start:dev
```

### 3- Frontend Kurulumu

Farklı bir terminal açarak `/frontend` dizinine geçin ve bağımlılıkları yükleyin:
```bash
cd frontend
npm install
```

`frontend` dizini içinde bir `.env.local` dosyası oluşturun ve Firebase Web configuration'dan aldığınız değerleri ekleyin:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
# Vapid key push notification izinleri için gereklidir (Project Settings -> Cloud Messaging kısmından Web Push Certificates altı)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
```

⚠️ **Önemli Adım:** `frontend/public/firebase-messaging-sw.js` dosyasını açıp config bilgilerini `.env` içindeki değerlerinizle güncelleyiniz. Service Worker'lar statik çalıştığı için doğrudan `.env` okuyamazlar, buraya sabit değerinizin elle girilmesi gereklidir (Demo amaçlı). 

Son olarak Frontend'i çalıştırın:
```bash
npm run dev
```

### 4- Sistemin Test Edilmesi

1. Tarayıcınızdan `http://localhost:3000` adresine gidin.
2. Ekranda **Enable Alerts** (Bildirimleri Etkinleştir) butonuna basın ve tarayıcı uyarısı çıktığında **İzin Ver** (Allow) deyin.
3. Bağlantı durumunun `Listening Live` olarak belirdiğini göreceksiniz; bu başarıyla token üretilip backend'e kaydedildiğini gösterir.
4. Ethereum ağında canlı test etmek için Backend terminalinden USDT kontratının `Transfer` olaylarının aktığını gözlemleyebilirsiniz. Biri `100.000` üzeri değer içerdiğinde `FCM` bildirim onayı gidecek ve tarayıcı ekranına düşecektir.
