# Ứng dụng web quản lý bán lẻ điện thoại - PhoneMartManager

[Chi tiết](https://docs.google.com/document/d/13biAcC49Pkg3FuyOmL-IW5c5hTNQRvzO/edit)

## Giới thiệu
PhoneMartManager Web-based application là hệ thống quản lý điểm bán hàng (POS) được thiết kế cho các cửa hàng bán lẻ bán điện thoại và phụ kiện. Ứng dụng web này phục vụ cho người dùng là nhân viên bán hàng và quản trị viên tại các cửa hàng bán lẻ điện thoại ở Việt Nam, cung cấp các chức năng cần thiết như giao dịch bán hàng, quản lý sản phẩm, quản lý nhân viên, và xem báo cáo và thống kê.

## Các tính năng

**Giao dịch bán hàng**: Xử lí giao dịch bán hàng một cách hiệu quả và nhanh chóng, bao gồm xử lý thanh toán và xử lý đơn hàng.

**Quản lý sản phẩm**: Quản lý thông tin về sản phẩm, bao gồm cập nhật giá, mô tả, tồn kho và các chi tiết liên quan khác.

**Quản lý nhân viên**: Quản lý thông tin nhân viên, bao gồm thông tin cá nhân, quyền hạn, và theo dõi hiệu suất làm việc.

**Xem báo cáo và thống kê**: Xem báo cáo hoạt động kinh doanh và thống kê chi tiết, bao gồm doanh số bán hàng, lợi nhuận, và các chỉ số hiệu suất khác.

## Đối tượng người dùng
- **Nhân viên bán hàng:** Sử dụng ứng dụng để thực hiện giao dịch bán hàng, quản lý sản phẩm và xem thông tin liên quan đến bán hàng.

- **Quản trị viên:** Sử dụng ứng dụng để quản lý nhân viên, sản phẩm và cung cấp cá nhân quản trị viên cái nhìn tổng quan về hoạt động kinh doanh cửa hàng.


## Các yêu cầu:
### Quản lý tài khoản:
- **Quản trị viên (admin):** Tài khoản quản trị được tích hợp sẵn với thông tin đăng nhập là admin/admin. Quản trị viên có quyền thay đổi mật khẩu của mình.
- **Nhân viên bán hàng:** Không có quyền tự tạo tài khoản. Tài khoản của nhân viên sẽ được quản trị viên tạo. Khi tạo tài khoản, quản trị viên cần được cung cấp ít nhất thông tin về họ tên và địa chỉ Gmail của nhân viên. *Một email thông báo về việc tạo tài khoản sẽ được gửi đến hộp thư của nhân viên*, kèm theo đường link để đăng nhập vào hệ thống. Đường link này chỉ có hiệu lực trong 1 phút, sau thời gian này, nhân viên cần phải yêu cầu sự hỗ trợ của admin để gửi lại 1 email khác.
- **Quy trình đăng nhập:** Đối với nhân viên mới chỉ đăng nhập lần đầu bằng link qua mail, họ không thể truy cập vào form login trực tiếp. Nếu họ cố tình truy cập vào form thì thông báo lỗi "Please login by clicking on the link in your email". Sau khi nhân viên mới đăng nhập lần đầu sẽ bị bắt đổi mật khẩu (không cần nhập lại mk cũ). Nếu không thì không được dùng chức năng của hệ thống ngoại trừ đăng xuất.
- **Thông tin đăng nhập:** Các người dùng cần sử dụng tên đăng nhập (username) là phần trước @ của địa chỉ email. Ví dụ: với admin@gmail.com, tên đăng nhập là admin. Đối với nhân viên mới, mật khẩu tạm thời cũng là tên đăng nhập. **(QUAN TRỌNG)** 
- **Cập nhật mật khẩu:** Nhân viên bất kể là quản trị viên hay không đều có thể xem và cập nhật thông tin cá nhân, bao gồm cả ảnh đại diện và mật khẩu.
- **Quản trị viên:** Có thể thực hiện các chức năng liên quan đến nhân viên, như xem danh sách nhân viên, xem thông tin chi tiết, gửi lại mail đăng nhập, khóa/mở tài khoản, xem doanh số bán hàng của nhân viên.

### Quản lý danh mục sản phẩm (chỉ quản trị viên):
- **Các chức năng:** Xem, thêm, cập nhật, xoá sản phẩm.
- **Thông tin sản phẩm:** Mỗi sản phẩm cần có ít nhất thông tin về mã vạch, tên, giá nhập, giá bán, danh mục, và ngày tạo.
- **Xoá sản phẩm:** Sản phẩm chỉ có thể bị xoá khi không nằm trong bất kỳ đơn hàng nào. Nếu sản phẩm đã được bán, nó không thể bị xóa.

### Quản lý khách hàng:
- **Quá trình thanh toán:** Nhân viên sẽ nhập số điện thoại của khách hàng tại quầy thanh toán.
- **Thông tin khách hàng:** Nếu khách hàng đã mua trước đó, thông tin về tên và địa chỉ sẽ tự động hiển thị.
- **Tạo tài khoản khách hàng:** Nếu đây là lần mua đầu tiên, nhân viên cần nhập đầy đủ thông tin về tên, địa chỉ để tạo tài khoản khách hàng (không được tạo thủ công).

### Xử lý giao dịch (chức năng chính):
- **Thêm sản phẩm vào giỏ hàng:** Nhân viên sẽ thêm sản phẩm vào danh sách mua hàng thông qua tìm kiếm hoặc quét mã vạch. Sản phẩm sẽ được hiển thị ngay trong danh sách và cập nhật tự động (Giống trong trung tâm thương mại).
- **Hiển thị sản phẩm đã thêm:** Sản phẩm được thêm vào giỏ hàng sẽ hiển thị trong một danh sách, cho phép xem thông tin chi tiết của các sản phẩm đã mua bao gồm: số lượng, giá đơn vị và tổng giá của mỗi sản phẩm. Giao diện tiếp theo thường sẽ cung cấp thông tin tóm tắt về đơn hàng bao gồm: tổng giá trị của toàn bộ đơn hàng, nơi nhập thông tin khách hàng (số điện thoại), cùng với các thông tin liên quan khác trong quá trình thanh toán, như số tiền khách hàng đưa và số tiền khách hàng nhận lại.
- **Cập nhật sản phẩm:** Khi sản phẩm được thêm vào (qua tìm kiếm hoặc quét mã vạch), nó sẽ được hiển thị ngay trong danh sách mà không cần xác nhận (để giúp nhân viên bán hàng thao tác dễ dàng), các tham số như tổng giá cũng cần được cập nhật tự động. Khi sản phẩm được cập nhật (ví dụ: cập nhật số lượng) hoặc bị xoá khỏi danh sách, các tham số cũng cần được cập nhật tự động.
- **Quy trình thanh toán:** Tại giao diện thanh toán, như đã đề cập trước đó, nhân viên bán hàng dễ dàng nhập số điện thoại hoặc nhập đầy đủ tên và địa chỉ nếu đây là khách hàng mới. Sau khi nhập đủ thông tin, quá trình thanh toán sẽ hoàn thành và một hóa đơn sẽ được tạo ra (có thể mô phỏng bằng cách tạo file hóa đơn PDF).

### Báo cáo và phân tích:
- **Xem báo cáo (admin và nhân viên):** Thống kê kết quả bán hàng theo thời gian: hôm nay, hôm qua, trong 7 ngày qua, tháng này hoặc một khoảng thời gian cụ thể. Bao gồm thông tin tổng số tiền, số đơn hàng, số sản phẩm và danh sách đơn hàng theo thứ tự thời gian. Đối với mỗi timeline, hệ thống hiển thị thông tin như tổng số nhập, số hóa đơn, số lượng sản phẩm cùng với danh sách đơn hàng được sắp xếp theo thứ tự thời gian. Nếu muốn, người xem có thể chọn 1 đơn hàng cụ thể để xem chi tiết.
- **Xem báo cáo (quản trị viên):** Quản trị viên có thể xem thêm thông tin về lợi nhuận tổng cộng.
