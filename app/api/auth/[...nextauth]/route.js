import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/user';
import { connectToDB } from '@/lib/mongodb';
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'you@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectToDB();

        // Find user by email
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error('No user found with this email');
        }

        if (!user.isVerified) {
          throw new Error('Please verify your email before logging in');
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Incorrect password');
        }

        // Return user object without password
        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      await connectToDB();
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        session.user.id = user._id.toString();
        session.user.username = user.username;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      await connectToDB();

      if (account.provider === 'google') {
        // Handle Google Sign-In
        const existingUser = await User.findOne({ email: profile.email });

        if (existingUser) {
            // Check if googleId is already linked
            if (!existingUser.googleId) {
              // Link Google account by adding googleId
              existingUser.googleId = profile.sub;
              await existingUser.save();
            }
            // Prevent duplicate accounts by ensuring googleId is unique
            else if (existingUser.googleId !== profile.sub) {
              // Another user might have used the same email with a different googleId
              throw new Error('Email already associated with another Google account.');
            }
          } else {
            // Derive username from email
            const baseUsername = profile.email.split('@')[0].toLowerCase();
            let finalUsername = baseUsername;
            let count = 1;
            while (await User.findOne({ username: finalUsername })) {
              finalUsername = `${baseUsername}${count}`;
              count++;
            }
  
            // Create new user with googleId
            await User.create({
              email: profile.email,
              username: finalUsername,
              image: profile.picture || '',
              googleId: profile.sub, // Store Google ID
              role: 'Student'
            });
          }

        return true;
      } else if (account.provider === 'credentials') {
        // Credentials sign-in is handled in authorize
        return true;
      }

      return false;
    },
    async redirect({ url, baseUrl }) {
      // Force the final destination to /home if sign-in was successful.
      return '/home';
    },
  },
  pages: {
    signIn: 'app/login/page.jsx',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt', // Use JWT for session strategy
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
