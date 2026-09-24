import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { verifyAdminToken, checkRateLimit } from '@/lib/security';

export async function POST(req: Request) {
  // Security Check: Verify Admin Authorization
  if (!verifyAdminToken(req.headers.get('authorization'))) {
    return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Validate image format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create target upload directory inside public folder (e.g. uploads/blog or uploads/donations)
    const folderType = (formData.get('folder') as string) === 'blog' ? 'blog' : 'donations';
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folderType);
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate clean unique filename
    const fileExt = path.extname(file.name) || (file.type === 'image/png' ? '.png' : '.jpg');
    const safeBaseName = path.basename(file.name, fileExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeBaseName}_${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, filename);

    // Write file to disk
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folderType}/${filename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'Failed to save uploaded file' }, { status: 500 });
  }
}
