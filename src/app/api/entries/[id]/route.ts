import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { entry } from '@/db/schema';
import { updateEntrySchema } from '@/lib/validations/entry';
import { eq } from 'drizzle-orm';

// GET /api/entries/[id] - Get single entry by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entryId = parseInt(id);

    if (isNaN(entryId)) {
      return NextResponse.json(
        { error: 'Invalid entry ID' },
        { status: 400 }
      );
    }

    const result = await db.select().from(entry).where(eq(entry.id, entryId));

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result[0] });
  } catch (error) {
    console.error('GET /api/entries/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entry' },
      { status: 500 }
    );
  }
}

// PUT /api/entries/[id] - Update entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entryId = parseInt(id);

    if (isNaN(entryId)) {
      return NextResponse.json(
        { error: 'Invalid entry ID' },
        { status: 400 }
      );
    }

    // Check if entry exists
    const existing = await db.select().from(entry).where(eq(entry.id, entryId));
    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate input with Zod (partial update allowed)
    const validationResult = updateEntrySchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Update database
    const updated = await db
      .update(entry)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(entry.id, entryId))
      .returning();

    return NextResponse.json({
      message: 'Entry updated successfully',
      data: updated[0],
    });
  } catch (error) {
    console.error('PUT /api/entries/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 }
    );
  }
}

// DELETE /api/entries/[id] - Delete entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entryId = parseInt(id);

    if (isNaN(entryId)) {
      return NextResponse.json(
        { error: 'Invalid entry ID' },
        { status: 400 }
      );
    }

    // Check if entry exists
    const existing = await db.select().from(entry).where(eq(entry.id, entryId));
    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    // Delete from database
    await db.delete(entry).where(eq(entry.id, entryId));

    return NextResponse.json({
      message: 'Entry deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/entries/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
}
