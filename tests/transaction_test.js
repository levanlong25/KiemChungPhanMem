Feature('Transaction Full Flow');

const unique = Date.now();
const user = {
  username: `user${unique}`,
  email: `user${unique}@gmail.com`,
  password: '123456'
};

let token = '';
let listingId = '';
let transactionId = '';

Scenario('FULL FLOW: transaction lifecycle', async ({ I }) => {

  // ========================
  // 1. REGISTER
  // ========================
  I.say('Register');
  await I.sendPostRequest('/user/api/register', user);
  I.seeResponseCodeIs(201);

  // ========================
  // 2. LOGIN
  // ========================
  I.say('Login');
  const loginRes = await I.sendPostRequest('/user/api/login', {
    email_username: user.username,
    password: user.password
  });

  I.seeResponseCodeIs(200);
  token = loginRes.data.access_token;

  I.amBearerAuthenticated(token);

  // ========================
  // 3. ADD BATTERY
  // ========================
  I.say('Bước 3: Add battery');
  I.amBearerAuthenticated(token);

  const batteryRes = await I.sendPostRequest('/listing/api/my-assets/batteries', {
    capacity_kwh: 75,
    health_percent: 95,
    manufacturer: "Tesla"
  });

  I.say('BATTERY: ' + JSON.stringify(batteryRes.data));
  I.seeResponseCodeIs(201);

  battery_id = batteryRes.data.battery.battery_id; // ⚠️ nhớ check field này đúng tên backend


  // ========================
  // 4. CREATE AUCTION
  // ========================
  I.say('Bước 4: Create auction');

  const createRes = await I.sendPostRequest('/auction/api/', {
    auction_type: "battery",

    // ✅ FIX: dùng battery_id (không phải vehicle_id)
    battery_id: battery_id,

    // ✅ FIX: bỏ timezone cho an toàn
    start_time: "2026-05-15T14:00:00",

    current_bid: 100
  });

  I.say('CREATE: ' + JSON.stringify(createRes.data));

  I.seeResponseCodeIs(201);

  auctionId = createRes.data.auction.auction_id;

  // ========================
  // 4. CREATE TRANSACTION
  // ========================
  I.say('Create transaction');

  const txRes = await I.sendPostRequest('/transaction/api/transactions', {
    seller_id: 1, 
    auction_id: auctionId,
    final_price: 100
  });

  I.say(JSON.stringify(txRes.data));
  I.seeResponseCodeIs(201);
});