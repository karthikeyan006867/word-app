import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/documents/[id] - Get single document
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        owner: { select: { name: true, email: true, image: true } },
        versions: { orderBy: { createdAt: 'desc' }, take: 10 },
        comments: {
          include: { user: { select: { name: true, email: true, image: true } } },
          orderBy: { createdAt: 'desc' }
        },
        collaborators: {
          include: { user: { select: { name: true, email: true, image: true } } }
        }
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 })
  }
}

// PUT /api/documents/[id] - Update document
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, content, isPublic } = body

    const document = await prisma.document.update({
      where: { id: params.id },
      data: {
        title: title || undefined,
        content: content || undefined,
        isPublic: isPublic !== undefined ? isPublic : undefined
      }
    })

    // Create version on significant changes
    if (content) {
      await prisma.version.create({
        data: {
          documentId: params.id,
          content,
          title: title || document.title
        }
      })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
  }
}

// DELETE /api/documents/[id] - Delete document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.document.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }
}
