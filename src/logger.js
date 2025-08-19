// logger.js
import { supabase } from './supabase'
const israelDate = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jerusalem' });
export async function logEvent({ userId, route, action, stepNumber = null, metadata = {} }) {
  const { data, error } = await supabase
    .from('logs')
    .insert([{
      user_id: userId,
      route,
      action,
      timestamp: israelDate, // נשלח לשדה timestamp
      step_number: stepNumber,
      metadata
    }])

  if (error) {
    console.error('❌ Error logging event:', error)
  } else {
    console.log('✅ Event logged:', data)
  }
}
