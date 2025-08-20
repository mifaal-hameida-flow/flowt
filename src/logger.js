// logger.js
import { supabase } from './supabase'
// const israelDate = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jerusalem' });
export async function logEvent({ userId, route, action, stepNumber = null, metadata = {}, userName}) {
  const { data, error } = await supabase
    .from('logs')
    .insert([{
      user_id: userId,
      route,
      action,
      step_number: stepNumber,
      metadata,
      user_name: userName
    }])

//   if (error) {
//     console.error('❌ Error logging event:', error)
//   } else {
//     console.log('✅ Event logged:', data)
//   }
}
