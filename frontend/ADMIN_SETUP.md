# Admin Role Implementation Guide

## Overview

This document explains how to set up and manage admin roles in the Preshot application using Supabase.

## Database Schema Updates

### 1. Add Admin Role Column to Profiles Table

First, you need to add an `is_admin` or `role` column to your profiles table. Run this SQL in your Supabase SQL Editor:

```sql
-- Option 1: Simple boolean flag
ALTER TABLE campprofiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Option 2: Role-based system (more flexible)
ALTER TABLE campprofiles ADD COLUMN role TEXT DEFAULT 'user';
-- Possible values: 'user', 'admin', 'mentor', 'super_admin'
```

### 2. Create Admin-Specific Policies

Update Row Level Security (RLS) policies to allow admins to view all user data:

```sql
-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON campprofiles FOR SELECT
USING (
  auth.uid() = id OR
  (SELECT is_admin FROM campprofiles WHERE id = auth.uid()) = TRUE
);

-- Allow admins to view all assessments
CREATE POLICY "Admins can view all assessments"
ON assessments FOR SELECT
USING (
  auth.uid() = user_id OR
  (SELECT is_admin FROM campprofiles WHERE id = auth.uid()) = TRUE
);

-- Allow admins to update user progress
CREATE POLICY "Admins can update user progress"
ON user_progress FOR ALL
USING (
  auth.uid() = user_id OR
  (SELECT is_admin FROM campprofiles WHERE id = auth.uid()) = TRUE
);
```

## Making a User an Admin

### Method 1: Direct SQL Update

To grant admin privileges to a specific user, run this SQL query in Supabase SQL Editor:

```sql
-- Find the user's ID first (if you don't know it)
SELECT id, email, full_name FROM auth.users WHERE email = 'admin@example.com';

-- Grant admin privileges using the user's ID
UPDATE campprofiles
SET is_admin = TRUE
WHERE id = 'USER_UUID_HERE';

-- Or if using role-based system:
UPDATE campprofiles
SET role = 'admin'
WHERE id = 'USER_UUID_HERE';
```

### Method 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **campprofiles**
3. Find the user row you want to make admin
4. Click on the `is_admin` cell and change it to `TRUE`
5. Save the changes

### Method 3: Programmatic Approach (for super admins)

Create an admin management page accessible only to existing admins:

```typescript
// Example function to grant admin access
async function grantAdminAccess(userId: string) {
  const { data, error } = await supabase
    .from("campprofiles")
    .update({ is_admin: true })
    .eq("id", userId);

  if (error) throw error;
  return data;
}
```

## Checking Admin Status in Frontend

### Update AuthContext to Include Admin Status

Modify `frontend/src/contexts/AuthContext.tsx` to fetch and expose admin status:

```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean; // Add this
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

// In the AuthProvider component:
const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  if (user) {
    // Fetch user profile to check admin status
    supabase
      .from("campprofiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setIsAdmin(data?.is_admin || false);
      });
  } else {
    setIsAdmin(false);
  }
}, [user]);
```

### Protecting Admin Routes

```typescript
// Create an AdminRoute component
export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
```

## Initial Admin Setup

### Creating the First Admin

Since you need an admin to create other admins, you'll need to manually create the first admin user:

1. **Sign up a regular user account** through the application
2. **Find the user's UUID** in Supabase:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'your-admin-email@example.com';
   ```
3. **Grant admin privileges**:
   ```sql
   UPDATE campprofiles SET is_admin = TRUE WHERE id = 'USER_UUID_FROM_STEP_2';
   ```

## Security Best Practices

1. **Never expose admin status in public APIs** - Always verify on the backend
2. **Use RLS policies** - Let Supabase handle access control at the database level
3. **Audit admin actions** - Consider creating an admin_actions table to log important changes
4. **Limit admin accounts** - Only grant admin access to trusted users
5. **Use environment-specific admins** - Different admins for development, staging, and production

## Testing Admin Access

After setting up an admin user:

1. Log in with the admin account
2. Navigate to `/mentors` - you should see the Mentor Dashboard (admin view)
3. Verify you can see all users' data
4. Test that non-admin users see the regular mentor list view

## Troubleshooting

### Admin status not updating

- Clear browser cache and local storage
- Check if the profile was created in `campprofiles` table
- Verify RLS policies are correctly configured

### Can't access admin features

- Confirm `is_admin` is `TRUE` in the database
- Check browser console for errors
- Verify the AuthContext is properly fetching admin status

## Future Enhancements

Consider implementing:

- **Role hierarchy**: super_admin > admin > mentor > user
- **Permission system**: Granular permissions instead of boolean admin flag
- **Admin dashboard**: Dedicated admin panel for user management
- **Audit logs**: Track all admin actions for security
