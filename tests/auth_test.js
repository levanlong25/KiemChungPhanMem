Feature('User Service Verification');

const unique = Date.now();
const user = {
    username: `user${unique}`,
    email: `user${unique}@gmail.com`,
    password: '123456',
    new_fullname: 'Lê Văn Long - UTH'
};

let token = '';

Scenario('Kiểm chứng luồng người dùng từ Đăng ký đến cập nhật Profile', async ({ I }) => {

    // --- 1. KIỂM CHỨNG ĐĂNG KÝ ---
    I.say('Bước 1: Đăng ký tài khoản');
    const registerRes = await I.sendPostRequest('/user/api/register', {
        email: user.email,
        username: user.username,
        password: user.password
    });

    I.seeResponseCodeIs(201);
    // Kiểm tra cấu trúc dữ liệu trả về từ UserService.create_user
    I.seeResponseContainsJson({
        message: "Registration successful!",
        user: {
            username: user.username,
            email: user.email,
            role: "member",
            status: "active"
        }
    });

    // --- 2. KIỂM CHỨNG ĐĂNG NHẬP ---
    I.say('Bước 2: Đăng nhập lấy JWT');
    const loginRes = await I.sendPostRequest('/user/api/login', {
        email_username: user.username,
        password: user.password
    });

    I.seeResponseCodeIs(200);
    I.seeResponseContainsKeys(['access_token']);
    token = loginRes.data.access_token;

    // --- 3. KIỂM CHỨNG TRUY XUẤT PROFILE ---
    I.say('Bước 3: Kiểm tra Profile mặc định (phải khớp với username)');
    I.amBearerAuthenticated(token);
    const profileRes = await I.sendGetRequest('/user/api/profile');

    I.seeResponseCodeIs(200);
    // ProfileService.create_empty_profile mặc định lấy username làm full_name
    I.seeResponseContainsJson({
        full_name: user.username 
    });

    // --- 4. KIỂM CHỨNG CẬP NHẬT PROFILE ---
    I.say('Bước 4: Cập nhật thông tin Profile');
    await I.sendPutRequest('/user/api/profile', {
        full_name: user.new_fullname,
        phone_number: '0901234567',
        address: 'Số 2 Võ Oanh, P.25, Bình Thạnh'
    });

    I.seeResponseCodeIs(200);
    I.seeResponseContainsJson({
        message: "Profile updated",
        profile: {
            full_name: user.new_fullname
        }
    });

    // --- 5. KIỂM CHỨNG XÓA TÀI KHOẢN ---
    I.say('Bước 5: Xóa tài khoản và kiểm tra tính toàn vẹn');
    await I.sendDeleteRequest('/user/api/account');
    I.seeResponseCodeIs(200);
    I.seeResponseContainsJson({ message: "User deleted successfully" });

    // Thử login lại bằng tài khoản vừa xóa -> Phải fail (401)
    await I.sendPostRequest('/user/api/login', {
        email_username: user.username,
        password: user.password
    });
    I.seeResponseCodeIs(401);
});