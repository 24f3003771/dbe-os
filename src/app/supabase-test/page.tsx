import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // This will try to fetch from a 'todos' table. 
  // It might fail if the table doesn't exist yet, but it verifies the connection.
  const { data: todos, error } = await supabase.from('todos').select()

  if (error) {
    console.error('Supabase error:', error)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      {error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error.message}
          <p className="text-sm mt-2">Note: This is expected if you haven't created the 'todos' table yet.</p>
        </div>
      ) : (
        <ul className="list-disc pl-5">
          {todos?.length === 0 && <p>Connected! No todos found (table is empty).</p>}
          {todos?.map((todo: any) => (
            <li key={todo.id}>{todo.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
