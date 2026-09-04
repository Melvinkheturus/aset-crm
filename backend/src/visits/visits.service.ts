import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class VisitsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(query?: { executive?: string; school_id?: string; date?: string; search?: string }) {
    let q = this.supabase
      .getClient()
      .from('visits')
      .select('*, schools(school_code, name, area, student_strength, lead_status, phone)')
      .order('visit_date', { ascending: false });

    if (query?.executive) {
      q = q.ilike('created_by', `%${query.executive}%`);
    }
    if (query?.school_id) {
      q = q.eq('school_id', query.school_id);
    }
    if (query?.date) {
      q = q.eq('visit_date', query.date);
    }
    if (query?.search) {
      q = q.or(`visit_code.ilike.%${query.search}%,remarks.ilike.%${query.search}%,person_met.ilike.%${query.search}%`);
    }

    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async create(createVisitDto: any) {
    if (!createVisitDto.visit_code) {
      const { count } = await this.supabase.getClient().from('visits').select('*', { count: 'exact', head: true });
      createVisitDto.visit_code = `VIS-${String((count || 0) + 1).padStart(4, '0')}`;
    }

    const { data, error } = await this.supabase
      .getClient()
      .from('visits')
      .insert(createVisitDto)
      .select('*, schools(*)')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getStats() {
    const { data: visits, error } = await this.supabase.getClient().from('visits').select('*');
    if (error) throw new Error(error.message);

    const stats = {
      total: visits.length,
      outcomes: {},
      executives: {},
      leadStatuses: {},
    };

    visits.forEach((v) => {
      const out = v.outcome || 'Unknown';
      stats.outcomes[out] = (stats.outcomes[out] || 0) + 1;

      const exec = v.created_by || 'Unassigned';
      stats.executives[exec] = (stats.executives[exec] || 0) + 1;

      const ls = v.lead_status_after_visit || 'Cold';
      stats.leadStatuses[ls] = (stats.leadStatuses[ls] || 0) + 1;
    });

    return stats;
  }
}
