import prisma from './prisma';

interface ICatalogUser {
    EMail : string,
    PasswordHash: string
}

export default class UserRepository {

  async getUser(email : string): Promise<ICatalogUser| null> {
    console.log("user:", email); 
    let user: ICatalogUser | null = await prisma.catalogUser.findFirst({
      where: {
        EMail: email,
      }
    });
    return user;
  }
}