'use client'

import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading editor...</div>
    </div>
  ),
})

export default function Home() {
  return <Editor />
}
