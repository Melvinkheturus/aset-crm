import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fdejzsuoezjwaqhdlwor.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZWp6c3VvZXpqd2FxaGRsd29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwMTgyNjYsImV4cCI6MjEwMjU5NDI2Nn0.kZ3Bkf_ruTS3bduv66XZCuM1gio5R01ey9tlkFJ8FOk';
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
