Feature('Report Full Flow');

const unique = Date.now();

const userA = {
  username: `userA_${unique}`,
  email: `userA_${unique}@gmail.com`,
  password: '123456'
};

let token = '';
let transactionId = '';
let reportId = '';

Scenario('FULL FLOW: report lifecycle', async ({ I }) => {

  // ========================
  // 1. REGISTER USER A
  // ========================
  I.say('Register user A');
  await I.sendPostRequest('/user/api/register', userA);
  I.seeResponseCodeIs(201);

  const loginA = await I.sendPostRequest('/user/api/login', {
    email_username: userA.username,
    password: userA.password
  });

  token = loginA.data.access_token;
  I.amBearerAuthenticated(token);
  // ========================
  // 4. CREATE REPORT
  // ========================
  I.say('Create report');

  const reportRes = await I.sendPostRequest('/report/api/reports', {
    transaction_id: 1,
    reported_user_id: 1, 
    reason: 'fraud',
    details: 'Test report'
  });

  I.say(JSON.stringify(reportRes.data));
  I.seeResponseCodeIs(201);

  reportId = reportRes.data.report.report_id;

  // ========================
  // 6. GET MY REPORTS
  // ========================
  I.say('Get my reports');

  await I.sendGetRequest('/report/api/reports/my-reports');
  I.seeResponseCodeIs(200);

  // ========================
  // 7. DELETE REPORT
  // ========================
  I.say('Delete report');

  await I.sendDeleteRequest(`/report/api/reports/${reportId}`);
  I.seeResponseCodeIs(200);

});