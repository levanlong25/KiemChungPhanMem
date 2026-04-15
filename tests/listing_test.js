Feature('Listing Service');

const unique = Date.now();
const user = {
  username: `user${unique}`,
  email: `user${unique}@gmail.com`,
  password: '123456'
};

let token = '';
let batteryId = '';
let listingId = '';

Scenario('FULL FLOW: battery listing lifecycle', async ({ I }) => {

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
  // 3. CREATE BATTERY
  // ========================
  I.say('Create battery');
  const batteryRes = await I.sendPostRequest('/listing/api/my-assets/batteries', {
    capacity_kwh: 75,
    health_percent: 95,
    manufacturer: 'Tesla'
  });

  I.seeResponseCodeIs(201);
  batteryId = batteryRes.data.battery.battery_id;

  // ========================
  // 4. CREATE LISTING
  // ========================
  I.say('Create listing');
  const listingRes = await I.sendPostRequest(
    `/listing/api/my-assets/batteries/${batteryId}/list`,
    {
      title: 'Battery Tesla',
      description: 'Good condition',
      price: 500
    }
  );

  I.seeResponseCodeIs(201);
  listingId = listingRes.data.listing.listing_id;

  // ========================
  // 5. GET MY BATTERIES
  // ========================
  I.say('Get my batteries');
  await I.sendGetRequest('/listing/api/my-assets/batteries');
  I.seeResponseCodeIs(200);

  // ========================
  // 6. GET MY VEHICLES
  // ========================
  I.say('Get my vehicles');
  await I.sendGetRequest('/listing/api/my-assets/vehicles');
  I.seeResponseCodeIs(200);

  // ========================
  // 7. FILTER LISTINGS
  // ========================
  I.say('Filter listings');
  await I.sendGetRequest('/listing/api/listings/filter?manufacturer=Tesla');
  I.seeResponseCodeIs(200);

  // ========================
  // 8. PUBLIC LISTINGS
  // ========================
  I.say('Get public listings');
  await I.sendGetRequest('/listing/api/listings');
  I.seeResponseCodeIs(200);

  // ========================
  // 9. UPDATE LISTING
  // ========================
  I.say('Update listing');
  const updateRes = await I.sendPutRequest(
    `/listing/api/listings/${listingId}`,
    {
      title: 'Updated Battery',
      price: 600
    }
  );

  I.seeResponseCodeIs(200);

  // ========================
  // 10. DELETE LISTING
  // ========================
  I.say('Delete listing');
  await I.sendDeleteRequest(`/listing/api/listings/${listingId}`);
  I.seeResponseCodeIs(200);

});