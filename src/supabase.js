// supabase.js
import { createClient } from '@supabase/supabase-js'

// את הערכים האלה מעתיקים מה-Supabase Dashboard
const supabaseUrl = 'https://whqdtbcoayczjlzgupgj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocWR0YmNvYXljempsemd1cGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzU1MDUsImV4cCI6MjA3MTAxMTUwNX0.yzudqsinYlbq1HaLSXFYlwLcDDRpcnayW7-N7czJ83M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
