import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SchoolsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(query?: { search?: string; lead_status?: string; area?: string; priority?: string }) {
    let q = this.supabase.getClient().from('schools').select('*').order('school_code', { ascending: true });

    if (query?.lead_status) {
      q = q.eq('lead_status', query.lead_status);
    }
    if (query?.area) {
      q = q.ilike('area', `%${query.area}%`);
    }
    if (query?.priority) {
      q = q.eq('priority', query.priority);
    }
    if (query?.search) {
      q = q.or(`name.ilike.%${query.search}%,school_code.ilike.%${query.search}%,contact_person.ilike.%${query.search}%,phone.ilike.%${query.search}%`);
    }

    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async findOne(id: string) {
    const { data: school, error: schoolErr } = await this.supabase
      .getClient()
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();

    if (schoolErr) throw new Error(schoolErr.message);

    // Fetch visits for this school
    const { data: visits } = await this.supabase
      .getClient()
      .from('visits')
      .select('*')
      .eq('school_id', id)
      .order('visit_date', { ascending: false });

    // Fetch planned visits for this school
    const { data: plans } = await this.supabase
      .getClient()
      .from('planned_visits')
      .select('*')
      .eq('school_id', id)
      .order('visit_date', { ascending: true });

    return {
      ...school,
      visits: visits || [],
      plans: plans || [],
    };
  }

  async create(createSchoolDto: any) {
    // Generate next school_code if not provided
    if (!createSchoolDto.school_code) {
      const { count } = await this.supabase.getClient().from('schools').select('*', { count: 'exact', head: true });
      createSchoolDto.school_code = `SCH-${String((count || 0) + 1).padStart(4, '0')}`;
    }

    const { data, error } = await this.supabase
      .getClient()
      .from('schools')
      .insert(createSchoolDto)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, updateDto: any) {
    const { data, error } = await this.supabase
      .getClient()
      .from('schools')
      .update({ ...updateDto, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}
