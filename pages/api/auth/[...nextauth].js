import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Basic auth map for Chili's team
        const validUsers = {
          'Chilis605': '3940Baldwin$$',
          'ChilisAdmin': '3940Baldwin$$'
        };

        const { username, password } = credentials;

        if (validUsers[username] && validUsers[username] === password) {
          return {
            id: username,
            name: username,
            email: `${username}@chilis.com`,
            access: username === 'ChilisAdmin' ? 'admin' : 'restaurant'
          };
        }

        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access = user.access;
        token.username = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.access = token.access;
      session.user.username = token.username;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET || 'chilis-onboarding-secret-key',
};

export default NextAuth(authOptions); 