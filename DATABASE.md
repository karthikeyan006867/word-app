# 🗄️ Database Integration Guide

This guide helps you add database functionality to enable cloud features like real-time collaboration, cloud storage, and user authentication.

## 📋 Prerequisites

Before integrating a database, you should have:
- ✅ Application deployed and working
- ✅ Basic understanding of databases
- ✅ Chosen your database solution

## 🎯 Recommended Stack

### Option 1: Supabase (Recommended) ⭐

**Why Supabase?**
- Free tier with generous limits
- Built-in authentication
- Real-time subscriptions
- PostgreSQL database
- Easy to use
- Great documentation

**Setup Steps:**

1. **Create Supabase Project**
```bash
# Go to https://supabase.com
# Create new project
# Copy your project URL and anon key
```

2. **Install Dependencies**
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

3. **Environment Variables**
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. **Database Schema**
```sql
-- Users table (handled by Supabase Auth)

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- Document versions table
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  version_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  position JSONB,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaborators table
CREATE TABLE collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  permission TEXT CHECK (permission IN ('read', 'write', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(document_id, user_id)
);

-- Templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL,
  category TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents
CREATE POLICY "Users can view their own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can insert their own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
  ON documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);
```

5. **Create Supabase Client**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

6. **Add Authentication**
```typescript
// src/components/Auth.tsx
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) console.error('Error:', error)
  }

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) console.error('Error:', error)
  }

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  )
}
```

7. **Save Documents to Cloud**
```typescript
// src/utils/cloudStorage.ts
import { supabase } from '@/lib/supabase'
import { Descendant } from 'slate'

export const saveDocument = async (title: string, content: Descendant[]) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('documents')
    .upsert({
      title,
      content,
      user_id: user.id,
      updated_at: new Date().toISOString()
    })
    .select()

  if (error) throw error
  return data
}

export const loadDocuments = async () => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}
```

8. **Real-time Collaboration**
```typescript
// src/hooks/useRealtimeCollaboration.ts
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export const useRealtimeCollaboration = (documentId: string) => {
  useEffect(() => {
    const channel = supabase
      .channel(`document:${documentId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'documents',
          filter: `id=eq.${documentId}`
        }, 
        (payload) => {
          // Update local document with changes
          console.log('Document updated:', payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [documentId])
}
```

### Option 2: Firebase

**Setup:**
```bash
npm install firebase
```

**Firebase Config:**
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
```

### Option 3: MongoDB + Express API

**Setup:**
```bash
npm install mongodb mongoose
```

**Create API Routes:**
```typescript
// src/app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Document from '@/models/Document'

export async function GET() {
  await connectDB()
  const documents = await Document.find()
  return NextResponse.json(documents)
}

export async function POST(request: NextRequest) {
  await connectDB()
  const body = await request.json()
  const document = await Document.create(body)
  return NextResponse.json(document)
}
```

## 🔐 Authentication Integration

### Update Document Store
```typescript
// src/store/documentStore.ts
import { create } from 'zustand'
import { saveDocument, loadDocuments } from '@/utils/cloudStorage'

interface User {
  id: string
  email: string
  name?: string
}

interface DocumentState {
  // ... existing state
  user: User | null
  isAuthenticated: boolean
  
  setUser: (user: User | null) => void
  saveToCloud: () => Promise<void>
  loadFromCloud: () => Promise<void>
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  // ... existing state
  user: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  saveToCloud: async () => {
    const { title, content, user } = get()
    if (!user) throw new Error('Not authenticated')
    await saveDocument(title, content)
  },
  
  loadFromCloud: async () => {
    const documents = await loadDocuments()
    // Handle loaded documents
  }
}))
```

## 📊 Features to Enable After Database Integration

### 1. Cloud Document Storage
- Replace localStorage with database
- Auto-sync on changes
- Cross-device access

### 2. Real-time Collaboration
- WebSocket connections
- Operational Transform (OT) or CRDT
- Live cursors and selections
- User presence

### 3. Advanced Version Control
- Unlimited versions
- Diff viewing
- Branch and merge
- Restore any version

### 4. Comments System
- Persistent comments
- Threaded discussions
- Mentions and notifications
- Resolved/unresolved tracking

### 5. User Management
- User profiles
- Teams and organizations
- Access permissions
- Sharing controls

### 6. Template Management
- Save custom templates
- Template library
- Public template sharing
- Template categories

### 7. Advanced Search
- Full-text search
- Search across all documents
- Filter by date, author, tags

### 8. Analytics
- Document statistics
- User activity
- Collaboration metrics
- Usage tracking

## 🚀 Migration Strategy

### Step 1: Add Authentication
1. Implement auth UI
2. Protect routes
3. Store user sessions

### Step 2: Migrate Local Storage
1. Keep localStorage as fallback
2. Add cloud sync option
3. Migrate existing docs on first login

### Step 3: Enable Collaboration
1. Add real-time listeners
2. Implement conflict resolution
3. Show active users

### Step 4: Advanced Features
1. Version control
2. Comments
3. Sharing
4. Templates

## 📝 Code Changes Required

### Update MenuBar.tsx
```typescript
// Add cloud sync button
<button onClick={handleCloudSync}>
  {isSyncing ? 'Syncing...' : 'Sync to Cloud'}
</button>
```

### Update Editor.tsx
```typescript
// Add real-time collaboration
const { activeUsers } = useRealtimeCollaboration(documentId)
```

### Update CommentsReview.tsx
```typescript
// Connect to database
const saveComment = async (comment: Comment) => {
  await supabase.from('comments').insert(comment)
}
```

## 🧪 Testing

1. **Local Development**
   - Use Supabase local development
   - Test auth flows
   - Test data persistence

2. **Staging**
   - Deploy to Vercel preview
   - Test with staging database
   - Invite beta testers

3. **Production**
   - Gradual rollout
   - Monitor errors
   - Backup data regularly

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Real-time Collaboration Guide](https://www.ably.com/blog/websockets-vs-long-polling)

## 🎯 Next Steps

1. Choose your database solution
2. Set up authentication
3. Implement cloud storage
4. Add real-time features
5. Deploy and test
6. Launch! 🚀

---

**Database integration unlocks the full potential of your word processor!**
