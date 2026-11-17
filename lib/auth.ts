import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { supabase } from './db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('ইমেইল এবং পাসওয়ার্ড দিন');
        }

        console.log("Checking user:", credentials.email);

        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (error) {
          console.log("Database Error:", error.message);
          throw new Error('ডাটাবেসে সমস্যা হয়েছে বা ইউজার নেই');
        }

        if (!user) {
          console.log("User not found");
          throw new Error('এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট নেই');
        }

        // 👇 পেমেন্ট চেক করার নতুন লজিক 👇
        if (!user.is_paid) {
          console.log("Payment not approved for:", user.email);
          throw new Error('আপনার পেমেন্ট এখনো অ্যাপ্রুভ হয়নি। অ্যাডমিন অ্যাপ্রুভ করার পর লগইন করুন।');
        }
        // 👆 ------------------------- 👆

        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        
        if (!isValid) {
          console.log("Password mismatch");
          throw new Error('পাসওয়ার্ড ভুল হয়েছে');
        }

        console.log("Login success for:", user.email);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          gender: user.gender,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.gender = (user as any).gender;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).gender = token.gender;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};