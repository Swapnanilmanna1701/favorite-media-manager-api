import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { entry } from '@/db/schema';
import { entrySchema } from '@/lib/validations/entry';
import { like, or, asc, desc } from 'drizzle-orm';

// GET /api/entries - List entries with pagination and search
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters. Page must be >= 1 and limit between 1-100' },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    // Build query with optional search filter
    let query = db.select().from(entry);
    
    if (search) {
      query = query.where(
        or(
          like(entry.title, `%${search}%`),
          like(entry.director, `%${search}%`)
        )
      ) as any;
    }

    // Apply sorting
    const orderColumn = sortBy === 'year' ? entry.year : 
                       sortBy === 'title' ? entry.title : 
                       entry.createdAt;
    query = query.orderBy(sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn)) as any;

    // Get paginated results
    const entries = await query.limit(limit).offset(offset);

    // Get total count for pagination metadata
    const totalQuery = db.select().from(entry);
    const allEntries = search 
      ? await totalQuery.where(
          or(
            like(entry.title, `%${search}%`),
            like(entry.director, `%${search}%`)
          )
        )
      : await totalQuery;
    
    const total = allEntries.length;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: entries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('GET /api/entries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

// POST /api/entries - Create new entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validationResult = entrySchema.safeParse(body);
    
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

    // Insert into database
    const newEntry = await db.insert(entry).values({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();

    return NextResponse.json(
      { 
        message: 'Entry created successfully', 
        data: newEntry[0] 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/entries error:', error);
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    );
  }
}
