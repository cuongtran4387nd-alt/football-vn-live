# Football VN Live v3

Dashboard bóng đá tiếng Việt chạy độc lập trên GitHub Pages.

## V3

- LIVE / sắp diễn ra / hoãn / kết thúc.
- Cửa sổ dữ liệu configurable: mặc định 24 giờ.
- Đếm ngược, phút thi đấu và tỷ số.
- Dedupe trận từ nhiều adapter.
- Fuzzy team matching để hợp nhất tên đội.
- Health report cho từng nguồn dữ liệu.
- Cache dữ liệu cuối cùng nếu một nguồn tạm lỗi.
- Bộ lọc giải/kênh/trạng thái.
- Tìm kiếm.
- Chuyển ngày.
- Auto-refresh frontend.
- PWA manifest + service worker.
- JSON feed: `data/matches.json`, `data/sources.json`, `data/health.json`.
- GitHub Actions cập nhật theo lịch và deploy Pages.
- Kênh tiếng Việt được lưu thành metadata/candidates, không tự ý nhúng stream hoặc vượt DRM.

## Nguồn

V3 dùng scoreboard metadata làm lớp lịch/trạng thái. ESPN Site API có endpoint scoreboard cho live và scheduled events; endpoint có thể truy vấn theo ngày. citeturn0search0turn0search1

Nếu nguồn lỗi, pipeline giữ dữ liệu hợp lệ cuối cùng và ghi trạng thái vào `data/health.json`.

## GitHub Actions

Scheduled workflows có thể bị trễ khi tải cao; GitHub cũng có thể tự disable scheduled workflows ở repository public nếu không có activity trong 60 ngày. Vì vậy v3 có cả `workflow_dispatch` để chạy thủ công. citeturn0news15turn0news28

## Cài

1. Tạo repo public.
2. Copy toàn bộ thư mục vào branch `main`.
3. Settings → Pages → Source → GitHub Actions.
4. Actions → Update football data → Run workflow.
5. Mở URL GitHub Pages.

## Thêm adapter

Mỗi adapter trong `scripts/sources/` trả về event chuẩn:

```json
{
  "id": "provider-event-id",
  "home": "Home",
  "away": "Away",
  "competition": "League",
  "start": "2026-08-29T12:00:00Z",
  "status": "live|upcoming|finished|postponed"
}
```

Chỉ thêm URL phát nếu bạn có quyền sử dụng nguồn đó.
