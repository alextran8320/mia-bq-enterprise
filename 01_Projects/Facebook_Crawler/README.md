# Hướng dẫn sử dụng Tool Crawl Dữ Liệu Facebook

Công cụ này sử dụng thư viện `facebook-scraper` để lấy các bài viết từ một Fanpage công khai. Do chính sách bảo mật của Facebook, bạn thường xuyên phải cung cấp **Cookies** để tránh bị chặn.

## Bước 1: Cài đặt thư viện

Bạn cần cài đặt Python trên máy, sau đó mở Terminal (hoặc Command Prompt) và chạy lệnh sau:

```bash
pip install facebook-scraper pandas openpyxl
```

## Bước 2: Lấy file Cookies (Quan trọng)

Để Facebook nhận diện bạn là người dùng thật, bạn cần cung cấp cookie đăng nhập của mình:
1. Mở trình duyệt Chrome / Cốc Cốc / Edge và đăng nhập vào Facebook của bạn.
2. Cài đặt tiện ích mở rộng: **Get cookies.txt LOCALLY** (hoặc EditThisCookie).
3. Đang ở tab Facebook, bấm vào tiện ích vừa cài và chọn **Export** (Tải xuống) để lưu file cookies.
4. Đổi tên file vừa tải về thành `cookies.txt` và để nó chung thư mục với file `crawler.py`.

## Bước 3: Chạy Tool Crawl

Mở Terminal tại thư mục chứa file `crawler.py` và chạy lệnh sau. 

Ví dụ crawl fanpage **Thần Kinh Trading** (ID trang là `thankinhtrading`):

```bash
# Lấy dữ liệu 2 trang (khoảng 40 bài viết) VÀ dùng cookies
python crawler.py thankinhtrading --pages 2 --cookies cookies.txt
```

**Các tham số khác:**
- `thankinhtrading`: Thay bằng ID của fanpage bạn muốn lấy (phần chữ nằm sau `facebook.com/`).
- `--pages 5`: Số trang muốn lướt qua (mỗi trang tầm vài bài đến 20 bài). Càng nhiều thì chạy càng lâu.
- `--cookies cookies.txt`: Đường dẫn tới file cookies bạn vừa tải.

## Bước 4: Xem kết quả
Sau khi chạy xong, tool sẽ tự động tạo ra một file `.csv` (ví dụ: `thankinhtrading_data.csv`) chứa toàn bộ nội dung bài viết, link bài, số like, comment, share, link ảnh,... Bạn có thể mở file này bằng Excel.
