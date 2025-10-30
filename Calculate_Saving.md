# Makerfile: Công thức Tiết kiệm & Cảnh báo Chi tiêu

Tài liệu này tổng hợp **(1)** công thức tính số tiền tiết kiệm gợi ý hàng ngày và **(2)** quy tắc cảnh báo khi chi tiêu vượt mức, kèm **pseudocode**, công thức Google Sheets và ví dụ minh hoạ. Bạn có thể copy trực tiếp phần nội dung bên dưới vào Google Docs / Google Sheets hoặc dùng làm tài liệu kỹ thuật cho dev.

---

## 1. Tham số chung (units: nghìn đồng)

* `X` : Thu nhập tháng
* `T_save` : Mục tiêu tiết kiệm cả tháng
* `N` : Số ngày trong tháng (30 hoặc 31)
* `D_avg` : Chi tiêu trung bình/ngày = (X - T_save) / N
* `S_min` : Số tiền tiết kiệm tối thiểu/ngày
* `S_max` : Số tiền tiết kiệm tối đa/ngày
* `epsilon` : hằng số nhỏ tránh chia 0 (ví dụ 0.01)
* `alpha` : hệ số làm mềm ngưỡng, `alpha ∈ [1.0, 1.2]`
* `beta` : buffer an toàn cho Target_daily, ví dụ `beta = 0.7`

---

## 2. Công thức tính số tiền tiết kiệm gợi ý/ngày (tuyến tính)

```
S_raw = S_min + (S_max - S_min) * (1 - d / (D_avg + epsilon))
S_today = min( max(S_raw, S_min), S_max )
```

* `d` = chi tiêu trong ngày.
* Khi `d` thấp → `S_today` tiến về `S_max`. Khi `d` cao → tiến về `S_min`.

### Tùy chọn phi tuyến (mượt hơn)

```
S_raw = S_min + (S_max - S_min) * exp( -k * d / D_avg )
S_today = min( max(S_raw, S_min), S_max )
```

* `k` điều chỉnh độ nhạy (thường 0.5..2).

---

## 3. Quy tắc cảnh báo chi tiêu vượt mức

**Ngưỡng an toàn:**

```
D_safe = alpha * D_avg
```

**Kích hoạt cảnh báo nếu:**

```
d_today > D_safe
```

**Hysteresis / cooldown:** chỉ báo tối đa 1 lần / 24h; hoặc tạm dừng nếu đã báo 3 ngày liên tiếp.

**Hành động khi cảnh báo bật:**

* Hiển thị banner / modal cảnh báo.
* Gợi ý: `S_today = S_min` (hoặc `0`).
* Nút: `[Tạm dừng tiết kiệm hôm nay]` và `[Xem kế hoạch bù đắp]`.

---

## 4. Auto-rebalancing: tính chi tiêu hợp lý cho các ngày còn lại

**Biến số bổ sung:**

* `t` : ngày hiện tại (1..N)
* `Y` : tổng chi tiêu đã qua (bao gồm hôm nay)
* `R = N - t` : số ngày còn lại

**Bước 1:**

```
Budget_for_spending = X - T_save
```

**Bước 2:**

```
Remaining_spend_budget = Budget_for_spending - Y
```

**Bước 3:**

```
Target_daily = Remaining_spend_budget / R
```

**Điều kiện kiểm tra:** nếu `Target_daily < 0` → báo người dùng đã vượt ngân sách; gợi ý hành động khẩn cấp.

**Bổ sung khi user tạm dừng tiết kiệm hôm nay:**

* Giảm tạm thời `T_save` bằng `S_today` đã bỏ qua, hoặc phân bổ lại phần tiết kiệm còn lại đều cho các ngày còn lại.

**Áp dụng buffer an toàn:**

```
Target_daily = max(Target_daily, beta * D_avg)
```

(nhằm tránh cắt quá sâu chi tiêu thiết yếu).

---

## 5. Pseudocode (tích hợp toàn bộ flow)

```
INPUT: X, T_save, N, S_min, S_max, epsilon, alpha, beta
FOR each day t from 1..N:
    read d_today
    D_avg = (X - T_save) / N
    D_safe = alpha * D_avg

    # 1) Phát hiện vượt mức
    if d_today > D_safe and not cooldown_active:
        show_alert()
        S_today = S_min  # hoặc 0 theo cấu hình
        # Gợi ý auto-rebalancing
        Y = total_spent_up_to_today
        R = N - t
        Budget_for_spending = X - T_save
        Remaining_spend_budget = Budget_for_spending - Y
        if Remaining_spend_budget <= 0:
            show_overspend_warning()
        else:
            Target_daily = Remaining_spend_budget / R
            Target_daily = max(Target_daily, beta * D_avg)
            show_rebalancing_plan(Target_daily)
        start_cooldown()
    else:
        # 2) Tính số tiết kiệm hôm nay theo công thức
        S_raw = S_min + (S_max - S_min) * (1 - d_today / (D_avg + epsilon))
        S_today = clamp(S_raw, S_min, S_max)
        offer_save(S_today)
    end if
END FOR
```

---

## 6. Công thức Google Sheets (copy → dán trực tiếp)

Giả sử bạn đặt các tham số như sau trong sheet:

* `B1` = X
* `B2` = T_save
* `B3` = N
* `B4` = S_min
* `B5` = S_max
* `B6` = epsilon
* `B7` = alpha
* `B8` = beta
* Hàng dữ liệu ngày bắt đầu từ dòng 11: `A11` = Ngày, `B11` = d (chi tiêu hôm đó), `C11` = Y (tổng đã tiêu đến hôm đó)

**Cột D (D_avg):**

```
= ( $B$1 - $B$2 ) / $B$3
```

**Cột E (D_safe):**

```
= $B$7 * D11   # nếu D11 chứa D_avg; hoặc = $B$7 * ( ($B$1 - $B$2)/$B$3 )
```

**Cột F (S_raw tuyến tính):**

```
= $B$4 + ( $B$5 - $B$4 ) * ( 1 - B11 / ( D11 + $B$6 ) )
```

**Cột G (S_today clamped):**

```
= MIN( MAX( F11, $B$4 ), $B$5 )
```

**Cột H (Budget_for_spending):**

```
= $B$1 - $B$2
```

**Cột I (Remaining_spend_budget):**

```
= H11 - C11   # H11 chứa Budget_for_spending, C11 chứa Y
```

**Cột J (R days left):**

```
= $B$3 - A11   # A11 chứa day t
```

**Cột K (Target_daily raw):**

```
= IF( J11>0, I11 / J11, "-" )
```

**Cột L (Target_daily with buffer):**

```
= IF( K11="-", "-", MAX( K11, $B$8 * D11 ) )
```

---

## 7. Ví dụ minh hoạ (đã có trong sheet mẫu)

* Bạn có thể dùng sheet mẫu để test các kịch bản: chi tiêu thấp, chi tiêu cao, tạm dừng tiết kiệm, và overspend.

---

## 8. Gợi ý tích hợp vào app

* Khi cảnh báo bật, hiển thị modal với các hành động: Tạm dừng tiết kiệm, Áp dụng kế hoạch bù đắp, Xem chi tiết.
* Lưu lịch sử cảnh báo để có thể phân tích hành vi và điều chỉnh alpha/k theo thời gian.

---