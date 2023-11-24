import { constants } from 'fs';
import prisma from './prisma';
import bcrypt from 'bcrypt';

interface ICatalogUser {
    EMail : string,
    PasswordHash: string
}

export default class UserRepository {

  async getUser(email : string, password: string): Promise<ICatalogUser| null> {
    console.log("user:", email, "password", password); 
    const user: ICatalogUser | null = await prisma.catalogUser.findFirst({
      where: {
        Email: email,
      }
    }) as ICatalogUser | null;
    
    console.log("Found user:", user);

    let pwComp : boolean = false;
    try { 
      // // uncomment this to perform a quick hash calc
      // let genPw = await bcrypt.hash(password, 10);
      // console.log("tried pw:", password, "h->", genPw);
      
      pwComp = await bcrypt.compare(password, user?.PasswordHash ?? "");  
    }
    catch(ex) {}

    return pwComp ? user : null;
  }
}