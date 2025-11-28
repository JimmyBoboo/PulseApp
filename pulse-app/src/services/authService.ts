export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) return null;

      const users = (await response.json()) as User[];

      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        console.log("Bruker ikke funnet");
        return null;
      }

      console.log("Login vellykket for:", user.name);

      localStorage.setItem("currentUser", JSON.stringify(user));

      return user;
    } catch (error) {
      console.error("Login feilet:", error);
      return null;
    }
  },

  async register(
    name: string,
    email: string,
    password: string,
    age: number
  ): Promise<User | null> {
    try {
      const existingResponse = await fetch("/api/users");
      if (existingResponse.ok) {
        const existingUsers = (await existingResponse.json()) as User[];
        const emailExists = existingUsers.some(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (emailExists) {
          console.error("Email er allerede registrert");
          return null;
        }
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          age,
          passwordHash: `hashed_${password}`,
        }),
      });

      if (!response.ok) {
        console.error("Kunne ikke opprette bruker");
        return null;
      }

      const newUser = (await response.json()) as User;
      console.log("Registrering vellykket for:", newUser.name);

      localStorage.setItem("currentUser", JSON.stringify(newUser));

      return newUser;
    } catch (error) {
      console.error("Registrering feilet:", error);
      return null;
    }
  },

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem("currentUser");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem("currentUser");
    console.log("Bruker logget ut");
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};
