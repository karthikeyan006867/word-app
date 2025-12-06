import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/documents - List all documents for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const documents = await prisma.document.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { collaborators: { some: { userId } } }
        ]
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        owner: { select: { name: true, email: true } },
        _count: { select: { versions: true, comments: true } }
      }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}

// POST /api/documents - Create a new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, ownerId, isPublic } = body

    if (!title || !content || !ownerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const document = await prisma.document.create({
      data: {
        title,
        content,
        ownerId,
        isPublic: isPublic || false
      },
      include: {
        owner: { select: { name: true, email: true } }
      }
    })

    // Create initial version
    await prisma.version.create({
      data: {
        documentId: document.id,
        content,
        title
      }
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}
