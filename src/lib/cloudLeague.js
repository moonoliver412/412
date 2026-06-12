// Live weekly league (backend-configured builds only). Joins this week's
// cohort, posts the local weekly XP through the server-side clamp, and
// returns the cohort rows. Returns null whenever the cloud is off or any
// call fails — the Leaderboard then keeps its simulated rivals.

import { cloudEnabled, supabase } from './supabase';
import { ensureSignedIn } from './cloudSync';

export async function fetchLiveLeague(weeklyXp) {
  if (!cloudEnabled) return null;
  try {
    await ensureSignedIn();
    const { data: me, error: joinError } = await supabase.rpc('join_league');
    if (joinError || !me) return null;
    await supabase.rpc('post_league_xp', { new_xp: weeklyXp });
    const { data: rows, error } = await supabase
      .from('league_members')
      .select('user_id, display_name, xp')
      .eq('week_start', me.week_start)
      .eq('league_id', me.league_id)
      .order('xp', { ascending: false });
    if (error || !rows) return null;
    return { rows, myUserId: me.user_id };
  } catch {
    return null;
  }
}
