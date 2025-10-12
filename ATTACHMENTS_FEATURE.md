# Attachments Feature

The attachments feature allows you to upload PDF files and images to individual items in your chattels inventory.

## Features

- **Upload files**: Attach PDF documents and images (JPEG, PNG, GIF, WebP) to any item
- **File size limit**: Maximum file size is 10MB per attachment
- **Secure storage**: Files are stored on the server in a configurable location
- **View attachments**: Click on attachment names to view them in a new tab
- **Delete attachments**: Remove attachments you no longer need
- **Hidden by default**: Attachments are collapsed to improve performance - only loaded when you expand the section

## Configuration

### Backend Configuration

The backend stores uploaded files in a configurable directory. By default, files are stored in `./uploads` relative to the backend directory.

To configure a custom storage location, add this to your `.env` file in the backend:

```env
ATTACHMENTS_STORAGE_PATH=/path/to/your/attachments/folder
```

For example:
```env
ATTACHMENTS_STORAGE_PATH=/Users/yourname/Documents/ChattelsAttachments
```

**Important**: Make sure the directory exists and the backend has write permissions.

### Frontend Usage

1. **View attachments**: Click the "Attachments (X)" button on any item to expand/collapse the attachments section

2. **Upload a file**: 
   - Click the "Upload File" button
   - Select a PDF or image file (max 10MB)
   - The file will be uploaded and appear in the list

3. **View a file**: Click on the file name to open it in a new browser tab

4. **Delete a file**: Click the trash icon next to any attachment and confirm the deletion

## File Organization

Files are organized on disk by item ID:
```
uploads/
  item_1/
    uuid-filename.pdf
    uuid-filename.jpg
  item_2/
    uuid-filename.png
```

Each file is renamed with a unique UUID to prevent filename conflicts.

## API Endpoints

- `GET /api/items/:itemId/attachments` - Get all attachments for an item
- `POST /api/items/:itemId/attachments` - Upload a new attachment
- `GET /api/attachments/:id` - Download/view an attachment
- `DELETE /api/attachments/:id` - Delete an attachment

## Database Schema

The `attachments` table stores metadata about each file:

```sql
CREATE TABLE attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  path TEXT NOT NULL,
  uploaded_at TEXT NOT NULL,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
)
```

When an item is deleted, all its attachments are automatically deleted from both the database and disk (cascade delete).

## Performance Considerations

- Attachments are only loaded when you expand the attachments section for an item
- This prevents unnecessary API calls and improves page load times
- The attachment count is fetched lazily when the section is expanded

## Allowed File Types

- **PDFs**: `application/pdf`
- **Images**: 
  - JPEG: `image/jpeg`, `image/jpg`
  - PNG: `image/png`
  - GIF: `image/gif`
  - WebP: `image/webp`

## Troubleshooting

### Files not uploading
- Check that the storage directory exists and has write permissions
- Verify file size is under 10MB
- Ensure file type is allowed (PDF or image)

### Can't view attachments
- Make sure the backend server is running
- Check that the `ATTACHMENTS_STORAGE_PATH` is correctly configured
- Verify the file exists on disk in the uploads directory

### Storage location
You can verify where files are being stored by checking the backend logs when a file is uploaded, or by looking at the `.env` file's `ATTACHMENTS_STORAGE_PATH` variable.
