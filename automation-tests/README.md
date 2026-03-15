# EV Platform Automation Tests

## Setup

```bash
pip install -r requirements.txt
```

## Environment Variables

Configure `postman/EV_Testing.postman_environment.json` with:
- `url_base`: Base URL of the API (e.g., `http://localhost/`)
- `token`: JWT token for authentication
- `username`: Test username
- `email`: Test email
- `password`: Test password

## Running Tests

Import the Postman collection and environment into Postman:

1. Open Postman
2. Click `Import`
3. Select `postman/EV_Platform_Automation.postman_collection.json`
4. Click `Environments` and import `postman/EV_Testing.postman_environment.json`
5. Run the collection with the environment

## Test Coverage

- User Service: Register, Login
- Report Service: Create, Delete, Get reports
- Additional services as configured in the collection

## Notes

- Ensure all microservices are running before executing tests
- Update environment variables for your deployment
- Token expires after 1 hour - refresh before running tests
