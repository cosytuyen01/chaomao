# Chào Mào — Quản lý sinh hoạt CLB

Web quản lý thông tin sinh hoạt CLB Chào Mào, xây dựng bằng **React** + **Firebase**.

## Tính năng

- **Lịch sinh hoạt tuần** — 7 ngày (Thứ 2 → Chủ nhật), để trống để thành viên điền hoạt động (VD: Thứ 2 ăn trái cây gì)
- **Đăng ký / Đăng nhập** — Firebase Authentication (email + mật khẩu)
- **Nhật ký đi dợt & đi thi** — Lưu lại thông tin mỗi lần đi dợt hoặc đi thi
- **Thông báo hàng ngày** — Nhắc hoạt động hôm nay theo lịch tuần (Browser Notification)

## Cài đặt

### 1. Yêu cầu

- Node.js 18+ (khuyến nghị 20+)
- Tài khoản [Firebase](https://console.firebase.google.com)

### 2. Tạo project Firebase

1. Vào [Firebase Console](https://console.firebase.google.com) → **Tạo project**
2. Bật **Authentication** → Sign-in method → **Email/Password**
3. Tạo **Firestore Database** (chế độ production hoặc test)
4. Vào **Project settings** → **Your apps** → thêm **Web app** → copy config

### 3. Cấu hình môi trường

```bash
cd chao-chao-mao
cp .env.example .env
```

Điền thông tin Firebase vào file `.env`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 4. Deploy Firestore Rules

Trong Firebase Console → Firestore → **Rules**, dán nội dung file `firestore.rules` hoặc dùng Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

### 5. Chạy ứng dụng

```bash
npm install
npm run dev
```

Mở http://localhost:5173

## Cấu trúc dữ liệu Firestore

| Collection / Document | Mô tả |
|---|---|
| `club/schedule` | Lịch sinh hoạt 7 ngày (dùng chung cho CLB) |
| `records` | Nhật ký đi dợt / đi thi |
| `users/{uid}` | Thông tin thành viên |
| `notificationSettings/{uid}` | Cài đặt thông báo cá nhân |

## Thông báo hàng ngày

- Vào tab **Thông báo** → cho phép trình duyệt gửi notification
- Chọn giờ nhắc (mặc định 7:00 sáng)
- Ứng dụng kiểm tra mỗi 30 giây; giữ tab mở để nhận thông báo đúng giờ
- Dùng **Gửi thử thông báo** để kiểm tra ngay

## Build production

```bash
npm run build
npm run preview
```

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Firebase Auth + Firestore
- React Router
- Browser Notification API
