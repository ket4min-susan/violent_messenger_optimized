# Violent Messenger Optimized
**Author:** Ket4min-Susan

Script tối ưu hóa hiệu suất cho Messenger.com thông qua Userscript (Tampermonkey/Violentmonkey).

## Mục tiêu
- Tăng tốc độ phản hồi giao diện.
- Giảm thiểu việc sử dụng CPU/GPU không cần thiết.
- **Không** làm thay đổi giao diện cốt lõi hay xóa bỏ tính năng.

## Cách cài đặt
1. Cài đặt tiện ích [Tampermonkey](https://www.tampermonkey.net/) hoặc [Violentmonkey](https://violentmonkey.github.io/) trên trình duyệt của bạn.
2. Nhấn vào file `violent_messenger_optimized.user.js` trong repo này (hoặc copy nội dung) và cài đặt vào tiện ích.
3. Reload trang Messenger.com để thấy sự thay đổi.

## Các kỹ thuật tối ưu
- **Content Visibility**: Sử dụng thuộc tính `content-visibility: auto` cho các danh sách dài để trình duyệt không phải render các phần tử ngoài màn hình.
- **Hardware Acceleration**: Kích hoạt tăng tốc phần cứng cho các thành phần cuộn.
- **Image Optimization**: Ép buộc giải mã ảnh bất đồng bộ (`decoding="async"`) để tránh chặn luồng chính.
- **Shadow & Blur reduction**: Giảm bớt các hiệu ứng bóng đổ và mờ nền nặng nề (có tùy chỉnh nhẹ để không làm xấu giao diện).
