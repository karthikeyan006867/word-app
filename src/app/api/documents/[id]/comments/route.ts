import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/documents/[id]/comments - Add comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { content, userId } = body

    if (!content || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        documentId: params.id,
        userId,
        content
      },
      include: {
        user: { select: { name: true, email: true, image: true } }
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
