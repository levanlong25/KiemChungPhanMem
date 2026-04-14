Feature('Review Service Verification');

const unique = Date.now();

const reviewData = {
    transaction_id: 1,
    reviewed_user_id: 2,
    rating: 5,
    comment: 'Sản phẩm tốt'
};

let token = '';
let reviewId = 0;

Scenario('Kiểm chứng luồng Review từ tạo → cập nhật → lấy → xóa', async ({ I }) => {

    // --- 1. LOGIN LẤY TOKEN ---
    I.say('Bước 1: Đăng nhập lấy JWT');
    const loginRes = await I.sendPostRequest('/user/api/login', {
        email_username: 'admin', // sửa theo user test của bạn
        password: '08102005'
    });

    I.seeResponseCodeIs(200);
    I.seeResponseContainsKeys(['access_token']);
    token = loginRes.data.access_token;

    I.amBearerAuthenticated(token);

    // --- 2. TẠO REVIEW ---
    I.say('Bước 2: Tạo review');
    const createRes = await I.sendPostRequest('/review/api/reviews', reviewData);

    I.seeResponseCodeIs(201);
    I.seeResponseContainsKeys(['review']);

    reviewId = createRes.data.review.review_id;

    I.seeResponseContainsJson({
        review: {
            transaction_id: reviewData.transaction_id,
            reviewed_user_id: reviewData.reviewed_user_id,
            rating: reviewData.rating,
            comment: reviewData.comment
        }
    });


    // --- 4. GET REVIEW BY ID ---
    I.say('Bước 4: Lấy review theo ID');
    const getRes = await I.sendGetRequest(`/review/api/reviews/${reviewId}`);

    I.seeResponseCodeIs(200);
    I.seeResponseContainsJson({
        review_id: reviewId
    });

    // --- 5. UPDATE REVIEW ---
    I.say('Bước 5: Cập nhật review');
    await I.sendPutRequest(`/review/api/reviews/${reviewId}`, {
        rating: 4,
        comment: 'Cập nhật lại comment'
    });

    I.seeResponseCodeIs(200);
    I.seeResponseContainsJson({
        review: {
            rating: 4,
            comment: 'Cập nhật lại comment'
        }
    });

    

    // --- 7. GET REVIEW BY USER ---
    I.say('Bước 7: Lấy review theo user');
    await I.sendGetRequest(`/review/api/reviews/user/${reviewData.reviewed_user_id}`);
    I.seeResponseCodeIs(200);

    // --- 8. GET MY REVIEWS ---
    I.say('Bước 8: Lấy review của chính mình');
    await I.sendGetRequest('/review/api/reviews/my-reviews');
    I.seeResponseCodeIs(200);

    // --- 9. GET REVIEW BY TRANSACTION ---
    I.say('Bước 9: Lấy review theo transaction');
    await I.sendGetRequest(`/review/api/reviews/transaction/${reviewData.transaction_id}`);
    I.seeResponseCodeIs(200);

    // --- 10. DELETE REVIEW ---
    I.say('Bước 10: Xóa review');
    await I.sendDeleteRequest(`/review/api/reviews/${reviewId}`);
    I.seeResponseCodeIs(200);
});