# Report Service

A Flask microservice for managing user reports in the EV Platform.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/report_db
JWT_SECRET_KEY=your_secret_key_here
INTERNAL_API_KEY=your_internal_api_key_here
FLASK_ENV=development
```

### 3. Database Migration

```bash
flask db upgrade
```

### 4. Run Service

```bash
python app.py
```

Service runs on `http://localhost:5006`

## Docker

### Build Image

```bash
docker build -t report-service:latest .
```

### Run Container

```bash
docker run -e DATABASE_URL="postgresql://..." \
           -e JWT_SECRET_KEY="..." \
           -e INTERNAL_API_KEY="..." \
           -p 5006:5006 report-service:latest
```

## API Endpoints

### User Endpoints (Require JWT)

- **POST** `/api/reports` - Create report
- **DELETE** `/api/reports/<id>` - Delete report
- **GET** `/api/reports/transaction/<id>` - Get reports for transaction
- **GET** `/api/reports/reported-user/<id>` - Get reports about user
- **GET** `/api/reports/my-reports` - Get user's reports

### Internal Endpoints (Require API Key Header: X-Internal-Api-Key)

- **GET** `/internal/reports` - List all reports
- **PUT** `/internal/reports/<id>/status` - Update report status
- **GET** `/internal/reports/by-reporter/<id>` - Get reporter's reports

## Database

Report model includes:

- `report_id` - Primary key
- `reporter_id` - User making report
- `transaction_id` - Transaction being reported
- `reported_user_id` - User being reported
- `reason` - Report reason (max 100 chars)
- `details` - Additional details
- `status` - pending, reviewed, resolved, dismissed
- `created_at`, `updated_at` - Timestamps

Unique constraint: One report per user per transaction

## Validation

- Reporter cannot report themselves
- Reason must be 1-100 characters
- Status changes only allowed through internal API
- User can only delete their own reports

## Testing

See `automation-tests/` for Postman collection with full test suite.
