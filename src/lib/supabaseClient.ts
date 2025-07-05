import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ituxhesnoyhxsvxeajtf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0dXhoZXNub3loeHN2eGVhanRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjgwNjMsImV4cCI6MjA2NjYwNDA2M30.LyPY4VRmSQQP6EV1pq_2RWutKn1sfxM2qE-Q2Vzwhy8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 