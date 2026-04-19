# 0. Góp ý chung
- Các trang Detail View của từng module bắt buộc phải có: Lịch sử 
# I. Quản lý khách hàng (Core CRM)
## 1. Giao diện List View khách hàng 
- Bổ sung và sắp xếp lại các cột thông tin  theo thứ tự sau: 
	- Mã KH - Khách hàng (có avt của KH) - SĐT - Email - Kênh - Nền tảng - Nguồn (Này là nguồn đồng bộ: MIA BOS, SAP B1,...) - Trạng thái - Liên hệ gần nhất - Đơn hàng - Assignee - Update At 
- Bổ sung thêm tính năng: 
	- Thêm KH mới 
	- Import KH 
	- Bộ lọc nâng cao (filter Col)
	- Cập nhật thông tin hàng loạt 
	- Xoá KH hàng loat 
	- Tìm trùng: 
		- Mô tả: Khi chọn tính năng này, hệ thống sẽ cho người dùng chọn tìm trùng theo thuộc tính năng > Sau khi chọn thuộc tính hệ thống liệt kê danh sách các record có thông tin trùng và cho phép merge dữ liệu 
			- ![[Pasted image 20260419192457.png]]
			- ![[Pasted image 20260419192512.png]]
		- Logic merge trùng: 
			- Cho phép user chọn những thông tin được gộp vào record chính đã chọn 
			- Dữ liệu bản ghi chính sẽ được giữ lại. Dữ liệu của các bản ghi khác sẽ bị xoá nhưng dữ liệu liên quan sẽ được giao cho bản ghi chính 
			- ![[Pasted image 20260419192522.png]]
## 2. Chi tiết Khách hàng
- Bổ sung thêm tab Chi tiết: Xem all các field đã lưu trong KH 
- Thông tin trong tab Tổng quan:
	- Thống kê nhanh số lượng: Đơn hàng, Tổng chi tiêu, Tổng lượt tương tác theo (Call, Tin nhắn)
	- Insight KH: Thông tin chung về KH (Tên, SĐT, Size giày, Phong cách, Địa chỉ,...)
	- AI Summary
	- Gợi ý hành động 
- Bổ sung thêm tab Hồ sơ đa kênh: Tab này lưu thông tin các link tương tác của KH và hồ sơ của KH ở các nền tảng nội bộ (Mã KH)
- Các tab: Đơn hàng, Cuộc gọi: Hiển thị dưới dạng bảng. Hiển thị các thông tin quan trọng của module đó 
## 3. Ẩn Module đầu mối 
# II. Danh mục và Thương mại (Master Data)
## 1. Sản phẩm 
### 1.1. Giao diện List View Sản phẩm
- Bổ sung và sắp xếp các cột thông tin trong danh sách:
	- Mã sản phẩm - Tên sản phẩm (Có hình thumnail của SP) - Giá gốc - Phân loại - Danh mục - Mô tả - Trạng thái (Đang bán, ngừng kinh doanh) - Nguồn - Giao cho - Update at 
- Cần phân tích lại SP Cha - SP Con (Biến thể) - SP Sàn (SP trên sàn đồng bộ về MIA BOS nếu có tích hợp)
- Bổ sung tính năng check tồn kho:
	- Chọn Tỉnh/TP
	- Chọn Phường/Xã 
	- Chọn Kho
	- Chọn sản phẩm/SKU/Mã SP/ Lô
	- Chọn biến thể (Màu sắc/Size)
	- Kết quả: 
		- Mã SP
		- Kho
		- SKU
		- Lô 
		- Số lượng tồn thực tế 
		- Số lượng tồn treo 
		- Số lượng tồn khả dụng 
		- Trạng thái 
### 1.2. Chi tiết sản phẩm 
- Thiết kế dưới dạng các tab thông tin
- Tab Chi tiết: 
	- Thống kê:
		- Thống kê nhanh số lượng đã bán ra 
		- Doanh thu 
		- Màu sắc bán chạy 
		- Size bán chạy 
	- Thông tin chi tiết các thuộc tính sản phẩm 
- Tab đơn hàng: Quan hệ 
- Tab Bảng giá: Thông tin bảng giá đang áp dụng
## 2. Bảng giá (có thể cân nhắc gộp vào thông tin chung của SP)
- Thông tin bảng giá sẽ được đồng bộ từ SAP B1 theo kênh bán hàng hoặc giá bán theo mùa, SP cận date,... 
- Bổ sung nút đồng bộ bảng giá 
## 3. Khuyến mãi
- Bổ sung tính năng tạo CTKM 
- Danh sách CTKM bao gồm:
	- Mã CT - Tên CT - Thời gian hiệu lực - Trạng thái - SP áp dụng - Chi nhánh - Update at
# III. Đơn hàng 
- Tách thành 2 đơn hàng: 
	- Đơn hàng bán 
	- Đơn hàng đổi trả 
## 1. Đơn hàng bán 
### 1.1. Giao diện List View
- Bổ sung nút tạo đơn hàng bán 
- Bổ sung bộ lọc nâng cao 
- Thông kê: 
	- Tổng số lượng đơn hàng 
	- Tổng doanh thu 
	- Số lượng đơn hàng theo từng trạng thái 
- Bổ sung và sắp xếp các cột thông tin đơn hàng:
	- Mã đơn hàng - Khách hàng - SĐT - Địa chỉ giao hàng - Giá trị - Nguồn - Trạng thái - ĐVVC - Mã Shipping - Giao cho - Update at 
### 1.2. Giao diện Detail View
- Điều chỉnh về dạng tab thông tin Tổng quan - Chi tiết và quan hệ với module đơn hàng 
- Tab Tổng quan:
	- Thông tin chung về đơn hàng 
	- Lịch sử vận chuyển 
- Tab chi tiết 
- Các tab quan hệ với đơn hàng có thể có: 
	- CTKM 
	- Phiếu xuất kho 
	- Đơn hàng đổi trả 
	- Hoạt động 
## 2. Bổ sung đơn hàng đổi trả
- Thông tin tương tự đơn hàng bán tuy nhiên khác về thông tin trạng thái 
- Thông tin trạng thái có thể ngược lại với đơn hàng bán 
- Đơn hàng đổi trả cần link đến đơn hàng gốc 
# IV. Setting 
- Đưa các menu còn lại vào icon Setting kế thông tin User 
- Danh sách menu setting bao gồm: 
	- Hồ sơ của tôi 
	- Quản lý người dùng 
		- Người dùng 
		- Vai trò 
		- Hồ sơ phân quyền mẫu
- Tích hợp hệ thống 
	- Danh sách hệ thống tích hợp 
		- Cấu hình tần xuất đồng bộ dữ liệu 
	- Log tích hợp 
	- Hàng đợi xử lý 
	- Kết nối đa kênh 
		- Cấu hình phân bổ dữ liệu theo kênh 
- Quy tắc vi phạm => Không hiểu mục đích -> Ẩn 
- Nguồn & Mapping => Không hiểu mục đích -> Ẩn 
# V. Trung tâm kiến thức 
- Cần tách thêm menu con 
	- Quy tắc 
	- Kiến thức 

