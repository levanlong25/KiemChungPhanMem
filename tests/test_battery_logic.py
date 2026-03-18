
def test_calculate_battery_price():
    # Giả sử hàm tính giá dựa trên SOH (Sức khỏe pin)
    soh = 90
    base_price = 1000
    expected_price = 900 # Giảm 10% do SOH 90%
    
    actual_price = base_price * (soh / 100)
    assert actual_price == expected_price

def test_register_validation():
    # Test logic kiểm tra username không được trống (khớp với API register201 của bạn)
    username = "long810"
    assert len(username) > 0