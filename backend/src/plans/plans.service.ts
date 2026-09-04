import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PlansService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(query?: { date?: string; start_date?: string; end_date?: string; status?: string }) {
    let q = this.supabase
      .getClient()
      .from('planned_visits')
      .select('*, schools(school_code, name, area, phone, contact_person, lead_status, student_strength)')
      .order('visit_date', { ascending: true })
      .order('visit_order', { ascending: true, nullsFirst: false });

    if (query?.date) {
      q = q.eq('visit_date', query.date);
    }
    if (query?.start_date && query?.end_date) {
      q = q.gte('visit_date', query.start_date).lte('visit_date', query.end_date);
    }
    if (query?.status) {
      q = q.eq('status', query.status);
    }

    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async create(createPlanDto: any) {
    if (!createPlanDto.plan_code) {
      const { count } = await this.supabase.getClient().from('planned_visits').select('*', { count: 'exact', head: true });
      createPlanDto.plan_code = `PLN-${String((count || 0) + 1).padStart(4, '0')}`;
    }

    const { data, error } = await this.supabase
      .getClient()
      .from('planned_visits')
      .insert(createPlanDto)
      .select('*, schools(*)')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateOrder(id: string, visit_order: number) {
    const { data, error } = await this.supabase
      .getClient()
      .from('planned_visits')
      .update({ visit_order, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateStatus(id: string, status: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('planned_visits')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}
