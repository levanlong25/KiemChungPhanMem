Feature('Battery + Auction Full Flow');

const unique = Date.now();
const user = {
  username: `user${unique}`,
  email: `user${unique}@gmail.com`,
  password: '123456'
};

let token = '';
let batteryId = '';
let auctionId = '';

Scenario('FULL FLOW: register → login → add battery → create → get → delete auction', async ({ I }) => {

  // ========================
  // 1. REGISTER
  // ========================
  I.say('Bước 1: Register');
  const registerRes = await I.sendPostRequest('/user/api/register', {
    username: user.username,
    email: user.email,
    password: user.password
  });

  I.say('REGISTER: ' + JSON.stringify(registerRes.data));
  I.seeResponseCodeIs(201);


  // ========================
  // 2. LOGIN
  // ========================
  I.say('Bước 2: Login');
  const loginRes = await I.sendPostRequest('/user/api/login', {
    email_username: user.username,
    password: user.password
  });

  I.say('LOGIN: ' + JSON.stringify(loginRes.data));
  I.seeResponseCodeIs(200);

  token = loginRes.data.access_token;


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
    start_time: "2026-04-15T14:00:00",

    current_bid: 100
  });

  I.say('CREATE: ' + JSON.stringify(createRes.data));

  I.seeResponseCodeIs(201);

  auctionId = createRes.data.auction.auction_id;


  // ========================
  // 5. GET AUCTION
  // ========================
  I.say('Bước 5: Get auction');

  const getRes = await I.sendGetRequest(`/auction/api/${auctionId}`);
  I.say('GET: ' + JSON.stringify(getRes.data));

  I.seeResponseCodeIs(200);


  // ========================
  // 6. DELETE AUCTION
  // ========================
  I.say('Bước 6: Delete auction');

  const deleteRes = await I.sendDeleteRequest(`/auction/api/auctions/${auctionId}`);
  I.say('DELETE: ' + JSON.stringify(deleteRes.data));

  I.seeResponseCodeIs(200);

});