# Attachments API Documentation

## Overview

Module quản lý file attachments cho tickets và comments. Hỗ trợ upload, download, list và delete files với validation và access control.

## Base URL

```
/api/attachments
```

## Authentication

Tất cả endpoints yêu cầu JWT authentication token trong header:

```
Authorization: Bearer <token>
```

## Endpoints

### 1. Upload Attachment

Upload file attachment cho ticket hoặc comment.

**Endpoint:** `POST /attachments/upload`

**Content-Type:** `multipart/form-data`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | File | Yes | File to upload (max 10MB) |
| type | String | Yes | 'ticket' or 'comment' |
| ticketId | UUID | Conditional | Required if type='ticket' |
| commentId | UUID | Conditional | Required if type='comment' |
| metadata | JSON | No | Additional metadata |

**Allowed File Types:**
- Images: jpeg, png, gif, webp
- Documents: pdf, doc, docx, xls, xlsx, txt, csv
- Archives: zip, rar

**Max File Size:** 10MB

**Response:** `201 Created`

```json
{
  "id": "uuid",
  "originalName": "document.pdf",
  "fileName": "1234567890-uuid.pdf",
  "mimeType": "application/pdf",
  "fileSize": 1024000,
  "fileSizeFormatted": "1.00 MB",
  "fileExtension": "pdf",
  "type": "ticket",
  "ticketId": "ticket-uuid",
  "uploadedById": "user-uuid",
  "isImage": false,
  "isPdf": true,
  "isDocument": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request`: Invalid file type, size exceeded, or missing required fields
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Upload failed

**Example (cURL):**

```bash
curl -X POST http://localhost:3000/api/attachments/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/file.pdf" \
  -F "type=ticket" \
  -F "ticketId=uuid"
```

---

### 2. List Attachments

Lấy danh sách attachments, có thể filter theo entity type và ID.

**Endpoint:** `GET /attachments`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| entityType | String | No | 'ticket' or 'comment' |
| entityId | UUID | No | ID của ticket hoặc comment |

**Response:** `200 OK`

```json
[
  {
    "id": "uuid",
    "originalName": "screenshot.png",
    "fileName": "1234567890-uuid.png",
    "mimeType": "image/png",
    "fileSize": 512000,
    "fileSizeFormatted": "500.00 KB",
    "fileExtension": "png",
    "type": "ticket",
    "ticketId": "ticket-uuid",
    "uploadedById": "user-uuid",
    "isImage": true,
    "isPdf": false,
    "isDocument": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Example:**

```bash
# List all attachments
curl -X GET http://localhost:3000/api/attachments \
  -H "Authorization: Bearer <token>"

# List attachments for specific ticket
curl -X GET "http://localhost:3000/api/attachments?entityType=ticket&entityId=uuid" \
  -H "Authorization: Bearer <token>"
```

---

### 3. Get Attachment Details

Lấy thông tin chi tiết của một attachment.

**Endpoint:** `GET /attachments/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Attachment ID |

**Response:** `200 OK`

```json
{
  "id": "uuid",
  "originalName": "report.pdf",
  "fileName": "1234567890-uuid.pdf",
  "mimeType": "application/pdf",
  "fileSize": 2048000,
  "fileSizeFormatted": "2.00 MB",
  "fileExtension": "pdf",
  "type": "ticket",
  "ticketId": "ticket-uuid",
  "uploadedById": "user-uuid",
  "metadata": {
    "description": "Monthly report"
  },
  "isImage": false,
  "isPdf": true,
  "isDocument": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `404 Not Found`: Attachment not found

---

### 4. Download Attachment

Download file attachment.

**Endpoint:** `GET /attachments/:id/download`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Attachment ID |

**Response:** `200 OK`

- Content-Type: File's MIME type
- Content-Disposition: `attachment; filename="original-filename.ext"`
- Content-Length: File size in bytes
- Body: File stream

**Error Responses:**

- `403 Forbidden`: No permission to download
- `404 Not Found`: Attachment or file not found

**Example:**

```bash
curl -X GET http://localhost:3000/api/attachments/uuid/download \
  -H "Authorization: Bearer <token>" \
  -o downloaded-file.pdf
```

---

### 5. Delete Attachment

Xóa attachment (soft delete).

**Endpoint:** `DELETE /attachments/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Attachment ID |

**Authorization:** Admin or IT_Staff only

**Response:** `200 OK`

```json
{
  "message": "Attachment deleted successfully"
}
```

**Error Responses:**

- `403 Forbidden`: No permission to delete
- `404 Not Found`: Attachment not found

**Example:**

```bash
curl -X DELETE http://localhost:3000/api/attachments/uuid \
  -H "Authorization: Bearer <token>"
```

---

## Access Control

### Upload
- Tất cả authenticated users có thể upload

### Download
- Tất cả authenticated users có thể download
- Business rules có thể được thêm vào để restrict access

### Delete
- Chỉ Admin và IT_Staff
- Hoặc user đã upload file đó

---

## File Storage

### Local Storage (Current)
- Path: `./uploads/attachments/`
- Filename format: `{timestamp}-{uuid}.{extension}`
- Soft delete: File vẫn còn trên disk sau khi delete

### Future: Cloud Storage
- AWS S3
- Azure Blob Storage
- Google Cloud Storage

---

## Validation Rules

### File Type
- Whitelist approach
- Kiểm tra MIME type
- Allowed types xem trong config

### File Size
- Max: 10MB (configurable)
- Kiểm tra trước khi save

### Security
- Filename sanitization
- Path traversal prevention
- Virus scanning (future)

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | No file provided | File field is missing |
| 400 | File type not allowed | MIME type not in whitelist |
| 400 | File size exceeds limit | File > 10MB |
| 400 | ticketId required | Missing ticketId for ticket attachment |
| 400 | commentId required | Missing commentId for comment attachment |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | No permission for action |
| 404 | Not Found | Attachment or file not found |
| 500 | Internal Server Error | Upload or processing failed |

---

## Integration Examples

### Upload from Frontend (React)

```javascript
const uploadAttachment = async (file, ticketId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'ticket');
  formData.append('ticketId', ticketId);

  const response = await fetch('/api/attachments/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};
```

### Display Attachments

```javascript
const AttachmentList = ({ ticketId }) => {
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    fetch(`/api/attachments?entityType=ticket&entityId=${ticketId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setAttachments(data));
  }, [ticketId]);

  return (
    <div>
      {attachments.map(att => (
        <div key={att.id}>
          <a href={`/api/attachments/${att.id}/download`}>
            {att.originalName} ({att.fileSizeFormatted})
          </a>
        </div>
      ))}
    </div>
  );
};
```

---

## Testing

Run test script:

```bash
.\test-attachments-module.ps1
```

Manual testing với Postman hoặc cURL theo examples trên.
