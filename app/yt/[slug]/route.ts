import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  
  try {
    const supabase = getSupabaseServerClient()
    
    // Look up the attribution
    const { data: attribution, error } = await supabase
      .from('youtube_attributions')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error || !attribution) {
      // Fallback: redirect to homepage with generic youtube UTM
      return NextResponse.redirect(
        new URL(`/?utm_source=youtube&utm_medium=video&utm_campaign=${slug}`, request.url),
        { status: 302 }
      )
    }
    
    // Increment hit counter (fire and forget)
    supabase
      .from('youtube_attributions')
      .update({ 
        hits: attribution.hits + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', attribution.id)
      .then(() => {})
    
    // Build redirect URL with UTM params
    const redirectUrl = new URL(attribution.redirect_url || '/', request.url)
    redirectUrl.searchParams.set('utm_source', attribution.utm_source || 'youtube')
    redirectUrl.searchParams.set('utm_medium', attribution.utm_medium || 'video')
    redirectUrl.searchParams.set('utm_campaign', attribution.utm_campaign || slug)
    
    return NextResponse.redirect(redirectUrl, { status: 302 })
  } catch (err) {
    // On any error, redirect to homepage
    return NextResponse.redirect(
      new URL(`/?utm_source=youtube&utm_medium=video&utm_campaign=${slug}`, request.url),
      { status: 302 }
    )
  }
}
