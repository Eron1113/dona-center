/**
 * DonaCenter — create admin account
 * Creates the store owner in Supabase Auth (email confirmed, no link needed)
 * and marks them as is_admin in the profiles table.
 *
 * Add ADMIN_PASSWORD to .env.local first, then run:
 *   node supabase/create-admin.js
 */
const { createClient } = require("@supabase/supabase-js");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "donacenter16@gmail.com";
const password = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
if (!password) {
  console.error("Missing ADMIN_PASSWORD in .env.local");
  process.exit(1);
}

const sb = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

(async () => {
  // Check if the user already exists
  const { data: existing } = await sb.auth.admin.listUsers({ perPage: 1000 });
  const found = existing?.users?.find(u => u.email === email);

  let userId = found?.id;

  if (found) {
    console.log("Admin user already exists — updating password to match.");
    const { error: updErr } = await sb.auth.admin.updateUserById(found.id, { password });
    if (updErr) console.error("Password update failed:", updErr.message);
  } else {
    console.log(`Creating admin user ${email}...`);
    const { data, error } = await sb.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // no confirmation email needed
    });
    if (error) {
      console.error("Create user FAILED:", error.message);
      process.exit(1);
    }
    userId = data.user.id;
  }

  // Mark as admin in profiles
  const { data: prof, error: profErr } = await sb
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!prof) {
    // Profile row missing (e.g. created before the trigger existed) — insert it
    const { error: insErr } = await sb.from("profiles").upsert({
      id: userId,
      email,
      is_admin: true,
    });
    if (insErr) {
      console.error("Mark admin FAILED:", insErr.message);
      process.exit(1);
    }
  } else {
    const { error: updErr } = await sb
      .from("profiles")
      .update({ is_admin: true, email })
      .eq("id", userId);
    if (updErr) {
      console.error("Mark admin FAILED:", updErr.message);
      process.exit(1);
    }
  }

  console.log("ADMIN READY ✅");
  console.log("Email: " + email);
})();
