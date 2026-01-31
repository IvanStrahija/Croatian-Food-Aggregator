'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export function SiteHeader() {
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          Croatian Food Aggregator
        </Link>
        <nav className="flex items-center gap-3">
          {status === 'loading' ? (
            <span className="text-sm text-gray-500">Checking session...</span>
          ) : session ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin/restaurants/new"
                  className="rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 hover:border-purple-300 hover:bg-purple-100"
                >
                  Add Restaurant
                </Link>
              )}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
