// logger.js
import { supabase } from './supabase'

export async function logEvent({ userId, route, action, stepNumber = null, option = null }) {
  const { data, error } = await supabase
    .from('logs')
    .insert([{
      user_id: userId,
      route,
      action,
      step_number: stepNumber,
      option
    }])

  if (error) {
    console.error('❌ Error logging event:', error)
  } else {
    console.log('✅ Event logged:', data)
  }
}
