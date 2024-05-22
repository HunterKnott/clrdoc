'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getURL } from '@/utils/helpers'

import { createClient } from '@/utils/supabase/server'
import { Provider } from '@supabase/supabase-js';

export async function login(formData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signUp(data)

  // Make sure to check email rate limit per hour
  if (error) {
    console.log(error);
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function oAuthSignIn(provider) {
  if(!provider) {
    return redirect('/login?message=No provider selected')
  }

  const supabase = createClient();
  const redirectUrl = getURL('/auth/callback')
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
    }
  })

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }

  return redirect(data.url)
}